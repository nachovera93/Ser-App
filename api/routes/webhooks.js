const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication.js");
var mqtt = require("mqtt");
const axios = require("axios");
const colors = require("colors");
const mongoose = require('mongoose');
const { VoltajeData, CorrienteData, PotenciaData, EnergiaData, THDData, FPData } = require('../models/dataModels');
import Data from "../models/data.js";
import Device from "../models/device.js";
import EmqxAuthRule from "../models/emqx_auth.js";
import Notification from "../models/notifications.js";
import AlarmRule from "../models/emqx_alarm_rule.js";
import Template from "../models/template.js";

var client;

//******************
//**** A P I *******
//******************

function checkToken(req, res, next) {
  if (req.headers.token != process.env.EMQX_API_TOKEN) {
    res.status(404).json();
  } else {
    next();
  }
}

//DEVICE CREDENTIALS WEBHOOK
router.post("/getdevicecredentials", async (req, res) => {
  try {
    const dId = req.body.dId;
    const password = req.body.password;
    const device = await Device.findOne({ dId: dId });
    if (password != device.password) {
      return res.status(401).json();
    }
    const userId = device.userId;
    var credentials = await getDeviceMqttCredentials(dId, userId);
    var template = await Template.findOne({ _id: device.templateId });
    var variables = [];
    template.widgets.forEach(widget => {
      var v = (({
        variable,
        variable2,
        variable3,
        NameWidget,
        variableFullName2,
        variableFullName3,
        variableType,
        variableSendFreq,
        n_variables,
        widget
      }) => ({
        variable,
        variable2,
        variable3,
        NameWidget,
        variableFullName2,
        variableFullName3,
        variableType,
        variableSendFreq,
        n_variables,
        widget
      }))(widget);

      variables.push(v);
    });

    const response = {
      username: credentials.username,
      password: credentials.password,
      topic: userId + "/" + dId + "/",
      variables: variables
    };

    res.json(response);

    setTimeout(() => {
      getDeviceMqttCredentials(dId, userId);
      console.log("Device Credentials Updated");
    }, 10000);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const variableToCollection = {
  Yb7TcLx9pK: 'VoltajeData',
  Qf4GjSd2hN: 'CorrienteData',
  Lm6VzKx8rJ: 'PotenciaData',
  Hc2BtFg9nR: 'EnergiaData'
};

const moment = require('moment-timezone');  // Importa las bibliotecas

router.post("/saver-webhook", checkToken, async (req, res) => {
  console.log("saver.webhook");
  try {
    const data = req.body;
    const splittedTopic = data.topic.split("/");
    const userId = splittedTopic[0];
    const dId = splittedTopic[1];
    const variable = splittedTopic[2];
    const NameWidget_0 = splittedTopic[3];
    const nameWidgets = NameWidget_0.split(',');
    var result = await Device.find({ dId: dId, userId: userId });

    console.log(data)
    if (result.length == 1) {
      const chileTime = moment().tz("America/Santiago").toDate();   // Genera la fecha y hora de Chile
      const collectionName = variableToCollection[variable];
      const Collection = mongoose.connection.collection(collectionName);

      let documentToSave = {
        userId: userId,
        dId: dId,
        timestamp: chileTime  // Usa chileTime para el campo timestamp
      };
      // Añade cada NameWidget y su valor al documento
      let index = 1;
      nameWidgets.forEach(nameWidget => {
        documentToSave[nameWidget] = data.payload[`value${index++}`] || data.payload["value"];
      });

      // Guarda el documento
      await Collection.insertOne(documentToSave);

      console.log("Data created");
      return res.status(200).json();
    } else {
      console.log("No creo data");
      return res.status(404).json();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});


//ALARMS WEBHOOK
router.post("/alarm-webhook", async (req, res) => {
  try {
    if (req.headers.token != process.env.EMQX_API_TOKEN) {
      res.status(404).json();
      return;
    }

    res.status(200).json();

    const incomingAlarm = req.body;

    updateAlarmCounter(incomingAlarm.emqxRuleId);

    const lastNotif = await Notification.find({
      dId: incomingAlarm.dId,
      emqxRuleId: incomingAlarm.emqxRuleId
    })
      .sort({ time: -1 })
      .limit(1);

    if (lastNotif == 0) {
      console.log("FIRST TIME ALARM");
      saveNotifToMongo(incomingAlarm);
      sendMqttNotif(incomingAlarm);
    } else {
      const lastNotifToNowMins = (Date.now() - lastNotif[0].time) / 1000 / 60;

      if (lastNotifToNowMins > incomingAlarm.triggerTime) {
        console.log("TRIGGERED");
        saveNotifToMongo(incomingAlarm);
        sendMqttNotif(incomingAlarm);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });

  }
});

//GET NOTIFICATIONS
router.get("/notifications", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    const notifications = await getNotifications(userId);

    const response = {
      status: "success",
      data: notifications
    };

    res.json(response);
  } catch (error) {
    console.log("ERROR GETTING NOTIFICATIONS");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//UPDATE NOTIFICATION (readed status)
router.put("/notifications", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;

    const notificationId = req.body.notifId;

    await Notification.updateOne(
      { userId: userId, _id: notificationId },
      { readed: true }
    );

    const response = {
      status: "success"
    };

    res.json(response);
  } catch (error) {
    console.log("ERROR UPDATING NOTIFICATION STATUS");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//**********************
//**** FUNCTIONS *******
//**********************

async function getDeviceMqttCredentials(dId, userId) {
  try {
    var rule = await EmqxAuthRule.find({
      type: "device",
      userId: userId,
      dId: dId
    });

    if (rule.length == 0) {
      const newRule = {
        userId: userId,
        dId: dId,
        username: makeid(10),
        password: makeid(10),
        publish: [userId + "/" + dId + "/+/+/sdata"],
        subscribe: [userId + "/" + dId + "/+/+/actdata"],
        type: "device",
        time: Date.now(),
        updatedTime: Date.now()
      };

      const result = await EmqxAuthRule.create(newRule);

      const toReturn = {
        username: result.username,
        password: result.password
      };

      return toReturn;
    }

    const newUserName = makeid(10);
    const newPassword = makeid(10);

    const result = await EmqxAuthRule.updateOne(
      { type: "device", dId: dId },
      {
        $set: {
          username: newUserName,
          password: newPassword,
          updatedTime: Date.now()
        }
      }
    );

    // update response example
    //{ n: 1, nModified: 1, ok: 1 }

    if (result.n == 1 && result.ok == 1) {
      return {
        username: newUserName,
        password: newPassword
      };
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function startMqttClient() {
  const options = {
    port: 1883,
    host: process.env.EMQX_API_HOST,
    clientId:
      "webhook_superuser" + Math.round(Math.random() * (0 - 10000) * -1),
    username: process.env.EMQX_NODE_SUPERUSER_USER,
    password: process.env.EMQX_NODE_SUPERUSER_PASSWORD,
    keepalive: 60,
    reconnectPeriod: 5000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    clean: true,
    encoding: "utf8"
  };

  client = mqtt.connect("mqtt://" + process.env.EMQX_API_HOST, options);

  client.on("connect", function () {
    console.log("MQTT CONNECTION -> SUCCESS;".green);
    console.log("\n");
  });

  client.on("reconnect", error => {
    console.log("RECONNECTING MQTT");
    console.log(error);
  });

  client.on("error", error => {
    console.log("MQTT CONNECIONT FAIL -> ");
    console.log(error);
  });
}

function sendMqttNotif(notif) {
  const topic = notif.userId + "/dummy-did/dummy-var/notif";
  const msg =
    "The rule: when the " +
    notif.NameWidget +
    " is " +
    notif.condition +
    " than " +
    notif.value;
  client.publish(topic, msg);
}

//GET ALL NOT READED NOTIFICATIONS
async function getNotifications(userId) {
  try {
    const res = await Notification.find({ userId: userId, readed: false });
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function saveNotifToMongo(incomingAlarm) {
  try {
    var newNotif = incomingAlarm;
    newNotif.time = Date.now();
    newNotif.readed = false;
    Notification.create(newNotif);
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateAlarmCounter(emqxRuleId) {
  try {
    await AlarmRule.updateOne(
      { emqxRuleId: emqxRuleId },
      { $inc: { counter: 1 } }
    );
  } catch (error) {
    console.log(error);
    return false;
  }
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

setTimeout(() => {
  startMqttClient();
}, 3000);

module.exports = router;
