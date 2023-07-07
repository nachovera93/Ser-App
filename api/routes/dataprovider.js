const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication.js");
const mongoose = require("mongoose");
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

const variableToCollection = {
  Yb7TcLx9pK: "VoltajeData",
  Qf4GjSd2hN: "CorrienteData",
  Lm6VzKx8rJ: "PotenciaData",
  Hc2BtFg9nR: "EnergiaData",
  Xs5MvPz3kD: "THDData",
  Aq8RtNf2pZ: "FPData"
};

//{ "value":22,"value2":11,"value3":33, "save":1 }
router.get("/get-last-data", checkAuth, async (req, res) => {
  try {
    console.log("get-last-data");
    console.log(req.query);
    const userId = req.userData._id;
    console.log(userId);
    const dId = req.query.dId;
    const variable = req.query.variable;
    const NameWidgets = req.query.NameWidget.split(",");  // Suponiendo que los NameWidgets se pasen como una cadena separada por comas

    const collectionName = variableToCollection[variable];

    if (collectionName) {
      const Collection = mongoose.connection.collection(collectionName);

      let data = [];  // Variable para almacenar los datos de todas las consultas

      for (const NameWidget of NameWidgets) {  // Iterar a través de todos los NameWidgets
        let query = {
          userId: userId,
          dId: dId,
        };
        query[NameWidget] = { $exists: true };

        const variableData = await Collection.find(query)
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();

        if (variableData.length > 0) {
          data.push({  // Agregar los datos a la matriz de datos
            variable: variable,
            name: NameWidget,
            value: variableData[0][NameWidget],
            timestamp: variableData[0].timestamp
          });
        } else {
          console.log(`No data found for variable: ${variable} y ${NameWidget}`);
        }
      }
      console.log("data");
       console.log(data);
      if (data.length > 0) {
        const response = {
          status: "success",
          data: data  // Devolver todos los datos en la respuesta
        };
        return res.json(response);
      } else {
        const response = {
          status: "error",
          error: `No data found for variable: ${variable}`
        };
        return res.json(response);
      }

    } else {
      console.log(`No collection found for variable: ${variable}`);
      const response = {
        status: "error",
        error: `No collection found for variable: ${variable}`
      };
      return res.json(response);
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



router.get("/get-small-charts-data", checkAuth, async (req, res) => {
  try {
    console.log("Entro get small chart data");
    console.log(req.query)
    const userId = req.userData._id;
    console.log(userId);
    const chartTimeAgo = req.query.chartTimeAgo;
    const dId = req.query.dId;
    const variable = req.query.variable;
    const nameWidgets = req.query.NameWidget.split(',');

    const timeAgoMs = Date.now() - chartTimeAgo * 60 * 1000;

    const collectionName = variableToCollection[variable];

    if (!collectionName) {
      throw new Error(`No collection found for variable: ${variable}`);
    }

    const Collection = mongoose.connection.collection(collectionName);
    console.log("Collection: ", collectionName);

    // Variable para almacenar los datos de todas las consultas
    let data = [];

    for (const nameWidget of nameWidgets) {  // Iterar a través de todos los nameWidgets
      let query = {
        userId: userId,
        dId: dId,
        timestamp: { $gt: new Date(timeAgoMs) } // Se quitó el .toISOString()
      };
      query[nameWidget] = { $exists: true };

      const variableData = await Collection.find(query)
        .sort({ timestamp: 1 })
        .toArray();

      // Si no se encontraron datos, continuar con la siguiente iteración
      if (!variableData.length) {
        console.log(`No data found for widget: ${nameWidget}`);
        continue;
      }

      // Añadir los datos a la matriz de datos
      variableData.forEach(entry => {
        let obj = {
          timestamp: entry.timestamp
        };
        obj[nameWidget] = entry[nameWidget];
        data.push(obj);
      });
    }

    console.log("data: ", data);
    const response = {
      status: "success",
      data: data
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

router.post("/update-tipo", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const idChart = req.body.idChart;
    const newTipoGrafico = req.body.tipo;
    console.log('userId', userId);
    console.log('idChart', idChart);
    console.log('newTipoGrafico', newTipoGrafico);

    const updateResult = await Template.updateOne(
      { userId: userId, "widgets.idChart": idChart },
      { $set: { "widgets.$.TipoGrafico": newTipoGrafico } }
    );

    if (updateResult.nModified === 1) {
      const response = {
        status: "success",
        message: "TipoGrafico actualizado con éxito",
      };
      return res.json(response);
    } else {
      const response = {
        status: "not_found",
        message: "No se encontró el widget con el idChart proporcionado",
      };
      return res.json(response);
    }
  } catch (error) {
    console.log(error);
    const response = {
      status: "error",
      error: error,
    };
    return res.json(response);
  }

});

router.get("/get-tipo", checkAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const idChart = req.query.idChart;
    console.log("userId: ", userId);
    console.log("idChart: ", idChart);

    const templates = await Template.find({
      userId: userId
    });

    if (templates) {
      console.log("Templates: ", templates);

      // Encuentra el objeto con los widgets
      const templateWithWidgets = templates.find(t =>
        t.widgets.some(widget => widget.idChart === idChart)
      );

      if (templateWithWidgets) {
        // Encuentra el widget específico
        const widget = templateWithWidgets.widgets.find(
          widget => widget.idChart === idChart
        );
        console.log("widget: ", widget);
        const response = {
          status: "success",
          data: {
            tipo: widget.TipoGrafico
          }
        };
        console.log("response: ", response);
        return res.json(response);
      } else {
        const response = {
          status: "not_found",
          message: "No se encontró el widget con el idChart proporcionado"
        };
        return res.json(response);
      }
    } else {
      const response = {
        status: "not_found",
        message: "No se encontró el documento con el userId proporcionado"
      };
      return res.json(response);
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
