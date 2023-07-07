
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  userId: { type: String, required: [true] },
  dId: { type: String, required: [true] },
  energia_fase_1_redcompañia_mensual: { type: Number },
  energia_fase_2_redcompañia_mensual:{ type: Number },
  energia_fase_3_redcompañia_mensual:{ type: Number },
  energia_fase_1_carga_mensual: { type: Number },
  energia_fase_2_carga_mensual:{ type: Number },
  energia_fase_3_carga_mensual:{ type: Number },
  energia_fase_1_paneles_mensual: { type: Number },
  energia_fase_2_paneles_mensual:{ type: Number },
  energia_fase_3_paneles_mensual:{ type: Number },
  //value: { type: Number, required: [true] },
  time: { type: Number, required: [true] }
});

// Convertir a modelo
const Mensual_Data = mongoose.model('monthmaxs', dataSchema)

export default Mensual_Data;