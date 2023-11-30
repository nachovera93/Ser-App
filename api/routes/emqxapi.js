const express = require("express");
const router = express.Router();
const axios = require("axios");
const colors = require("colors");


import EmqxAuthRule from "../models/emqx_auth.js";

const auth = {
  auth: {
    username: "admin",
    password: process.env.EMQX_DEFAULT_APPLICATION_SECRET
  }
};

global.saverResource = null;
global.alarmResource = null;


/* Este administrador corrobora que existan 2 recursos,
Si no hay ninguno, entonces los crea.
Si hay uno o más de dos, lanza advertencia. 
Para borrar manualmente los recursos y reiniciemos node */

//https://docs.emqx.io/en/broker/v4.1/advanced/http-api.html#response-code

//list resources
async function listResources() {

  try {
    console.log("Listing EMQX resources...");
    const url = "http://" + process.env.EMQX_API_HOST + ":8085/api/v4/resources/";
    const res = await axios.get(url, auth);
    console.log(`Respuesta de la lista de recursos: ${res.status}`);
    const resources = res.data.data;
    console.log(`Se encontraron ${resources.length} recursos`);

    const size = res.data.data.length;
    if (res.status === 200) {
      if (size == 0) {
        console.log("***** Creating emqx webhook resources *****".green);

        createResources();
      } else if (size == 2) {
        res.data.data.forEach(resource => {
          if (resource.description == "alarm-webhook") {
            global.alarmResource = resource;

            console.log("▼ ▼ ▼ ALARM RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
            console.log(global.alarmResource);
            console.log("▲ ▲ ▲ ALARM RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
            console.log("\n");
            console.log("\n");
          }

          if (resource.description == "saver-webhook") {
            global.saverResource = resource;

            console.log("▼ ▼ ▼ SAVER RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
            console.log(global.saverResource);
            console.log("▲ ▲ ▲ SAVER RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
            console.log("\n");
            console.log("\n");
          }
        });
      } else {
        function printWarning() {
          console.log(
            "DELETE ALL WEBHOOK EMQX RESOURCES AND RESTART NODE - youremqxdomain:8085/#/resources"
              .red
          );
          setTimeout(() => {
            printWarning();
          }, 1000);
        }

        printWarning();
      }
    } else {
      console.log("Error in emqx api");
    }
  } catch (error) {
    console.error("Error al listar los recursos de EMQX: ", error.message);
    console.error(error.response ? error.response.data : error); // Muestra más detalles del error si están disp
  }




}

//create resources
async function createResources() {

  try {
    console.log("Creando recursos de webhook EMQX...");
    const baseResourceURL = `http://${process.env.EMQX_API_HOST}:8085/api/v4/resources`;

    const data1 = {
      "type": "web_hook",
      "config": {
        url: "http://" + process.env.WEBHOOKS_HOST + ":3001/api/saver-webhook",
        headers: {
          token: process.env.EMQX_API_TOKEN
        },
        method: "POST"
      },
      description: "saver-webhook"
    }

    const data2 = {
      "type": "web_hook",
      "config": {
        url: "http://" + process.env.WEBHOOKS_HOST + ":3001/api/alarm-webhook",
        headers: {
          token: process.env.EMQX_API_TOKEN
        },
        method: "POST"
      },
      description: "alarm-webhook"
    }

    const saverResponse = await axios.post(baseResourceURL, data1, auth);
    console.log("Recurso de webhook para guardar creado:", saverResponse.data);

    // Crear alarm-webhook
    const alarmResponse = await axios.post(baseResourceURL, data2, auth);
    console.log("Recurso de webhook para alarma creado:", alarmResponse.data);

    // Verificar estado de los recursos
    await verifyResourcesStatus(saverResponse.data.data.id);
    await verifyResourcesStatus(alarmResponse.data.data.id);

  } catch (error) {
    console.error("Error al crear recursos EMQX", error.message);
    console.error(error.response ? error.response.data : error);
  }
}

// Verificar el estado de los recursos
async function verifyResourcesStatus(resourceId) {
  try {
    const statusURL = `http://${process.env.EMQX_API_HOST}:8085/api/v4/resources/${resourceId}/status`;
    const statusRes = await axios.get(statusURL, auth);

    if (statusRes.data.data.status === "running") {
      console.log(`Recurso ${resourceId} está corriendo correctamente.`);
    } else {
      console.error(`Recurso ${resourceId} está fuera de servicio.`);
      // Aquí puedes agregar lógica para manejar recursos fuera de servicio.
    }
  } catch (error) {
    console.error(`Error al verificar el estado del recurso ${resourceId}`, error.message);
    console.error(error.response ? error.response.data : error);
  }
}


//check if superuser exist if not we create one
global.check_mqtt_superuser = async function checkMqttSuperUser() {

  try {
    const superusers = await EmqxAuthRule.find({ type: "superuser" });

    if (superusers.length > 0) {

      return;

    } else if (superusers.length == 0) {

      await EmqxAuthRule.create(
        {
          publish: ["#"],
          subscribe: ["#"],
          userId: "emqxmqttsuperuser",
          username: process.env.EMQX_NODE_SUPERUSER_USER,
          password: process.env.EMQX_NODE_SUPERUSER_PASSWORD,
          type: "superuser",
          time: Date.now(),
          updatedTime: Date.now()
        }
      );

      console.log("Mqtt super user created")

    }
  } catch (error) {
    console.log("error creating mqtt superuser ");
    console.log(error);
  }
}



//setTimeout(() => {
//  console.log("Iniciando verificación de recursos EMQX...");
//  listResources();
//}, process.env.EMQX_RESOURCES_DELAY);

module.exports = router;
