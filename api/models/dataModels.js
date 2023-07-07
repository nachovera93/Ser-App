const mongoose = require('mongoose');
// Definir un objeto de esquema compartido entre varias colecciones
const dataSchema = new mongoose.Schema({
  userId: String,
  dId: String,
  variable: String,
  value: Number,
  time: Date,
  type: String
});

// Crear modelos para cada colección que utilizan el mismo objeto de esquema
const VoltajeData = mongoose.model('VoltajeData', dataSchema, 'voltajeData');
const CorrienteData = mongoose.model('CorrienteData', dataSchema, 'corrienteData');
const PotenciaData = mongoose.model('PotenciaData', dataSchema, 'potenciaData');
const EnergiaData = mongoose.model('EnergiaData', dataSchema, 'energiaData');
const THDData = mongoose.model('THDData', dataSchema, 'thdData');
const FPData = mongoose.model('FPData', dataSchema, 'fpData');


module.exports = {
  VoltajeData,
  CorrienteData,
  PotenciaData,
  EnergiaData,
  THDData,
  FPData
};
