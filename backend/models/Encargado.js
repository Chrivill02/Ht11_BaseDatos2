import mongoose from "mongoose";

const encargadoSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  dpi: String
});

export default mongoose.model("Encargado", encargadoSchema);
