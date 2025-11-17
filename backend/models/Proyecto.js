import mongoose from "mongoose";


const integranteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  edad: Number
}, { _id: false });


const familiaBeneficiadaSchema = new mongoose.Schema({
  direccion: String,
  ingresoMensual: Number,
  integrantes: [integranteSchema]
}, { _id: false });


const servicioSchema = new mongoose.Schema({
  servicio: String,
  precio: Number,
  cantidad: Number,
  subtotal: Number
}, { _id: false });


const proyectoSchema = new mongoose.Schema({
  nombre: String,
  fechaInicio: Date,
  fechaFin: Date,
  presupuesto: Number,
  finalizado: Boolean,
  encargado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Encargado"
  },

  servicios: [servicioSchema],

  familiasBeneficiadas: [familiaBeneficiadaSchema]
});

export default mongoose.model("Proyecto", proyectoSchema);