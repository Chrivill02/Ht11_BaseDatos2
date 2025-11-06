import mongoose from "mongoose";

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
  // Servicios relacionados con el proyecto
  servicios: [{
    servicio: String,
    precio: Number,
    cantidad: Number,
    subtotal: Number
  }]
});

export default mongoose.model("Proyecto", proyectoSchema);
