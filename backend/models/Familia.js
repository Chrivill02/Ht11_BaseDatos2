import mongoose from "mongoose";

const familiaBeneficiadaSchema = new mongoose.Schema({
  direccion: String,
  ingresoMensual: Number,
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto"
  },
  integrantes: [{
    nombre: String,
    apellido: String,
    edad: Number
  }]
});

export default mongoose.model("FamiliaBeneficiada", familiaBeneficiadaSchema);
