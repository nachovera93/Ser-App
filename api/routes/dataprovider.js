const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication.js");

import { min } from "d3";
//models import
import Data from "../models/data.js";
import Mensual_Data from "../models/data_day.js";
import Template from "../models/template.js";

function addToArray(array, value) {
  // Comprueba si el valor ya existe en el array
  if (array.indexOf(value) === -1) {
    // Si no existe, agrega el valor al array
    array.push(value);
  }
}

//{ "value":22,"value2":11,"value3":33, "save":1 }
router.get("/get-last-data", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const chartTimeAgo = req.query.chartTimeAgo;
    const dId = req.query.dId;
    const variable = req.query.variable;
    const variable2 = req.query.variable2;
    const variable3 = req.query.variable3;

    const data = await Data.find({
      userId: userId,
      dId: dId,
      variable: variable
    })
      .sort({ time: -1 })
      .limit(1);
    const data2 = await Data.find({
      userId: userId,
      dId: dId,
      variable: variable2
    })
      .sort({ time: -1 })
      .limit(1);
    const data3 = await Data.find({
      userId: userId,
      dId: dId,
      variable: variable3
    })
      .sort({ time: -1 })
      .limit(1);

    const response = {
      status: "success",
      data: data,
      data2: data2,
      data3: data3
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.get("/get-small-charts-data", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const chartTimeAgo = req.query.chartTimeAgo;
    const dId = req.query.dId;
    console.log(userId);
    console.log(req.query);
    const variables = [
      req.query.variable,
      req.query.variable2,
      req.query.variable3
    ].filter(Boolean);
    const timeAgoMs = Date.now() - chartTimeAgo * 60 * 1000;
    const data = [];
    const promises = [];
    for (let i = 0; i < variables.length; i++) {
      promises.push(
        Data.find({
          userId: userId,
          dId: dId,
          variable: variables[i],
          time: { $gt: timeAgoMs }
        }).sort({ time: 1 })
      );
    }
    const results = await Promise.all(promises);
    results.forEach(result => {
      data.push(result);
    });


    const response = {
      status: "success",
      data: data
      //data2: data2,
      //data3: data3
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.get("/get-data-between", checkAuth, async (req, res) => {
  console.log("get-data-between");
  try {
    const userId = req.userData._id;
    const timestamp_init = req.query.timestamp_init;
    const timestamp_end = req.query.timestamp_end;
    const dId = req.query.dId;
    //const variable = req.query.variable;
    console.log(userId);

    //console.log(timestamp_init / 1000);
    //console.log(timestamp_end / 1000);
    //const timeAgoMs = Date.now() - (chartTimeAgo * 60 * 1000 );
    const data = await Mensual_Data.find({
      userId: userId,
      time: { $gte: timestamp_init / 1000, $lt: timestamp_end / 1000 }
    }).sort({ time: 1 });
    console.log(data);
    const arrays = {
      times: [],
      energia_total_redcompañia_mensual: [],
      energia_fase1_redcompañia_mensual: [],
      energia_fase2_redcompañia_mensual: [],
      energia_fase3_redcompañia_mensual: [],
      energia_total_carga_mensual: [],
      energia_fase1_carga_mensual: [],
      energia_fase2_carga_mensual: [],
      energia_fase3_carga_mensual: [],
      energia_total_paneles_mensual: [],
      energia_fase1_paneles_mensual: [],
      energia_fase2_paneles_mensual: [],
      energia_fase3_paneles_mensual: []
    };

    var energia_redcompañia_mensual = 0;
    var energia_carga_mensual = 0;
    var energia_paneles_mensual = 0;
    const keys = Object.keys(data);
    for (const key in keys) {
      if (data[key].time) {
        arrays.times.push(data[key].time);
      }
      if (data[key].energia_fase_1_redcompañia_mensual) {
        energia_redcompañia_mensual =
          data[key].energia_fase_1_redcompañia_mensual;
        arrays.energia_fase1_redcompañia_mensual.push(
          data[key].energia_fase_1_redcompañia_mensual
        );
        //console.log(arrays.energia_fase1_redcompañia_mensual)
      }
      if (data[key].energia_fase_2_redcompañia_mensual) {
        energia_redcompañia_mensual =
          energia_redcompañia_mensual +
          data[key].energia_fase_2_redcompañia_mensual;
        arrays.energia_fase2_redcompañia_mensual.push(
          data[key].energia_fase_2_redcompañia_mensual
        );
        //console.log(arrays.energia_fase2_redcompañia_mensual)
      }
      if (data[key].energia_fase_3_redcompañia_mensual) {
        energia_redcompañia_mensual =
          energia_redcompañia_mensual +
          data[key].energia_fase_3_redcompañia_mensual;
        arrays.energia_fase3_redcompañia_mensual.push(
          data[key].energia_fase_3_redcompañia_mensual
        );
        //console.log(arrays.energia_fase3_redcompañia_mensual)
        arrays.energia_total_redcompañia_mensual.push(
          energia_redcompañia_mensual
        );
        //console.log(arrays.energia_total_redcompañia_mensual)
      }

      if (data[key].energia_fase_1_carga_mensual) {
        energia_carga_mensual = data[key].energia_fase_1_carga_mensual;
        arrays.energia_fase1_carga_mensual.push(
          data[key].energia_fase_1_carga_mensual
        );
      }
      if (data[key].energia_fase_2_carga_mensual) {
        energia_carga_mensual =
          energia_carga_mensual + data[key].energia_fase_2_carga_mensual;
        arrays.energia_fase2_carga_mensual.push(
          data[key].energia_fase_2_carga_mensual
        );
      }
      if (data[key].energia_fase_3_carga_mensual) {
        energia_carga_mensual =
          energia_carga_mensual + data[key].energia_fase_3_carga_mensual;
        arrays.energia_fase3_carga_mensual.push(
          data[key].energia_fase_3_carga_mensual
        );
        arrays.energia_total_carga_mensual.push(energia_carga_mensual);
      }

      if (data[key].energia_fase_1_paneles_mensual) {
        energia_paneles_mensual = data[key].energia_fase_1_paneles_mensual;
        arrays.energia_fase1_paneles_mensual.push(
          data[key].energia_fase_1_paneles_mensual
        );
      }
      if (data[key].energia_fase_2_paneles_mensual) {
        energia_paneles_mensual =
          energia_paneles_mensual + data[key].energia_fase_2_paneles_mensual;
        arrays.energia_fase2_paneles_mensual.push(
          data[key].energia_fase_2_paneles_mensual
        );
      }
      if (data[key].energia_fase_3_paneles_mensual) {
        energia_paneles_mensual =
          energia_paneles_mensual + data[key].energia_fase_3_paneles_mensual;
        arrays.energia_fase3_paneles_mensual.push(
          data[key].energia_fase_3_paneles_mensual
        );
        arrays.energia_total_paneles_mensual.push(energia_paneles_mensual);
      }

      //if (data[key]=="energia_fase_1_redcompañia_mensual") {
      //  console.log("Existe!!!")
      // }
    }
    const timestamps = arrays.times.filter(
      (item, index) => arrays.times.indexOf(item) === index
    );
    const formattedDates = timestamps.map(timestamp => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
      });
    });
    console.log(formattedDates);
    console.log(arrays.energia_total_redcompañia_mensual);
    console.log(arrays.energia_total_carga_mensual);
    console.log(arrays.energia_total_paneles_mensual);
    console.log(
      "energia_fase1_redcompañia_mensual :",
      arrays.energia_fase1_redcompañia_mensual
    );
    console.log(
      "energia_fase2_redcompañia_mensual :",
      arrays.energia_fase2_redcompañia_mensual
    );
    console.log(
      "energia_fase3_redcompañia_mensual:",
      arrays.energia_fase3_redcompañia_mensual
    );
    console.log(
      "energia_fase1_carga_mensual :",
      arrays.energia_fase1_carga_mensual
    );
    console.log(
      "energia_fase2_carga_mensual :",
      arrays.energia_fase2_carga_mensual
    );
    console.log(
      "energia_fase3_carga_mensual :",
      arrays.energia_fase3_carga_mensual
    );
    console.log(
      "energia_fase1_paneles_mensual :",
      arrays.energia_fase1_paneles_mensual
    );
    console.log(
      "energia_fase2_paneles_mensual :",
      arrays.energia_fase2_paneles_mensual
    );
    console.log(
      "energia_fase3_paneles_mensual :",
      arrays.energia_fase3_paneles_mensual
    );

    //  const pipeline_1 = [
    //    {
    //       $match: {
    //          userId: "629141a62052def848c8801b",
    //          time: { $gte: timestamp_init , $lt: timestamp_end }
    //       }
    //    },
    //    {
    //      $group: {
    //        _id: "$time",
    //        sum: { $add: ["$energia_fase_1_redcompañia_mensual", "$energia_fase_2_redcompañia_mensual", "$energia_fase_3_redcompañia_mensual"] }
    //     }
    //    },
    //    {
    //       $sort: {
    //          time: 1
    //       }
    //    }
    // ];
    //
    //  Mensual_Data.aggregate(pipeline_1).exec(function(err, result) {
    //    if (err) throw err;
    //    console.log(result); // result es un documento con los campos sum, sum y sum con la suma de todos los valores de los campos energia_fase_1_paneles_mensual, energia_fase_2_paneles_mensual y energia_fase_3_paneles_mensual de todos los documentos de la colección
    //  });

    const pipeline = [
      {
        $match: {
          userId: userId,
          time: { $gte: timestamp_init / 1000, $lt: timestamp_end / 1000 }
        }
      },
      {
        $group: {
          _id: null,
          promedio: { $avg: "$energia_fase_1_redcompañia_mensual" },
          promedio2: { $avg: "$energia_fase_2_redcompañia_mensual" },
          promedio3: { $avg: "$energia_fase_3_redcompañia_mensual" },
          max: { $max: "$energia_fase_1_redcompañia_mensual" },
          max2: { $max: "$energia_fase_2_redcompañia_mensual" },
          max3: { $max: "$energia_fase_3_redcompañia_mensual" },
          min: { $min: "$energia_fase_1_redcompañia_mensual" },
          min2: { $min: "$energia_fase_2_redcompañia_mensual" },
          min3: { $min: "$energia_fase_3_redcompañia_mensual" }
        }
      }
    ];
    Mensual_Data.aggregate(pipeline).exec(function(err, result) {
      if (err) throw err;
      console.log(result); // result es un documento con el campo promedio que contiene el promedio del campo energia_fase_1_redcompañia_mensual para los documentos que cumplen la condición
      const response = {
        status: "success",
        time: formattedDates,
        promedio_energia_fase_1_redcompañia_mensual: result[0].promedio,
        promedio_energia_fase_2_redcompañia_mensual: result[0].promedio2,
        promedio_energia_fase_3_redcompañia_mensual: result[0].promedio3,
        max_energia_fase_1_redcompañia_mensual: result[0].max,
        max_energia_fase_2_redcompañia_mensual: result[0].max2,
        max_energia_fase_3_redcompañia_mensual: result[0].max3,
        min_energia_fase_1_redcompañia_mensual: result[0].min,
        min_energia_fase_2_redcompañia_mensual: result[0].min2,
        min_energia_fase_3_redcompañia_mensual: result[0].min3,
        energia_total_redcompañia_mensual:
          arrays.energia_total_redcompañia_mensual,
        energia_total_carga_mensual: arrays.energia_total_carga_mensual,
        energia_total_paneles_mensual: arrays.energia_total_paneles_mensual,
        energia_fase1_redcompañia_mensual:
          arrays.energia_fase1_redcompañia_mensual,
        energia_fase2_redcompañia_mensual:
          arrays.energia_fase2_redcompañia_mensual,
        energia_fase3_redcompañia_mensual:
          arrays.energia_fase3_redcompañia_mensual,
        energia_fase1_carga_mensual: arrays.energia_fase1_carga_mensual,
        energia_fase2_carga_mensual: arrays.energia_fase2_carga_mensual,
        energia_fase3_carga_mensual: arrays.energia_fase3_carga_mensual,
        energia_fase1_paneles_mensual: arrays.energia_fase1_paneles_mensual,
        energia_fase2_paneles_mensual: arrays.energia_fase2_paneles_mensual,
        energia_fase3_paneles_mensual: arrays.energia_fase3_paneles_mensual
      };
      return res.json(response);
    });
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.post("/post-status-indicator", checkAuth, async (req, res) => {
  try {
    const { status, variable } = req.body;

    // Buscar documento que tenga la variable indicada
    const template = await Template.findOne({ "widgets.variable": variable });

    // Actualizar el estado de la variable en el widget correspondiente
    const widgets = template.widgets.map(widget => {
      if (widget.variable === variable) {
        return { ...widget, status };
      } else {
        return widget;
      }
    });

    // Actualizar el documento con los widgets actualizados
    await Template.findByIdAndUpdate(
      template._id,
      { $set: { widgets } },
      { new: true }
    );

    const response = {
      status: "success"
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});


router.post("/get-data-day", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const color = req.body.color;
    const name = req.body.nameTemplate;
    console.log("Name ", req.body);
    const variable = req.body.variable;
    const data = await Template.find({ "widgets.variable": variable });
    console.log(data);

    const result = await Template.updateMany(
      { "widgets.variable": variable },
      { $set: { "widgets.$.class": color } }
    );
    console.log(result);
    //var aux = [];
    const response = {
      status: "success"
      //data: color,
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.post("/post-color", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const color = req.body.color;
    const name = req.body.nameTemplate;
    console.log("Name ", req.body);
    const variable = req.body.variable;
    const data = await Template.find({ "widgets.variable": variable });
    console.log(data);

    const result = await Template.updateMany(
      { "widgets.variable": variable },
      { $set: { "widgets.$.class": color } }
    );
    console.log(result);
    //var aux = [];
    const response = {
      status: "success"
      //data: color,
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.post("/post-tipo", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const tipo = req.body.tipo;
    const name = req.body.nameTemplate;
    console.log("Name ", req.body);
    const variable = req.body.variable;
    const data = await Template.find({ "widgets.variable": variable });
    console.log(data);

    const result = await Template.updateMany(
      { "widgets.variable": variable },
      { $set: { "widgets.$.tipo": tipo } }
    );
    console.log(result);
    const response = {
      status: "success"
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.get("/get-tipo", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const variable = req.query.variable;
    const data = await Template.find({
      userId: userId,
      "widgets.variable": variable
    });
    for (let i = 0; i < data[0].widgets.length; i++) {
      console.log(data[0].widgets[i].variable);
      if (data[0].widgets[i].variable == variable) {
        const tipoGrafico1 = data[0].widgets[i].TipoGrafico1;
        const tipoGrafico2 = data[0].widgets[i].TipoGrafico2;
        const response = {
          status: "success",
          tipoGrafico1: tipoGrafico1,
          tipoGrafico2: tipoGrafico2
        };
        return res.json(response);
      }
    }
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.get("/get-color", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const variable = req.query.variable;
    const data = await Template.find({
      userId: userId,
      "widgets.variable": variable
    });
    for (let i = 0; i < data[0].widgets.length; i++) {
      console.log(data[0].widgets[i].variable);
      if (data[0].widgets[i].variable == variable) {
        console.log(data[0].widgets[i].class);
        const colorReturn = data[0].widgets[i].class;
        const response = {
          status: "success",
          color: colorReturn,
          data: variable
        };
        return res.json(response);
      }
    }
    // Si JSON.stringify(data[0].widgets[i].variable) es igual a req.query.variable .. igualarlo a data y enviarlo a front
    //Poner findOne
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

router.get("/credentials", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const response = {
      status: "success",
      data: userId
    };
    return res.json(response);
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error
    };
    return res.json(response);
  }
});

module.exports = router;
