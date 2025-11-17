import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Encargado from "./models/Encargado.js";
import Proyecto from "./models/Proyecto.js";
// import Familia from "./models/Familia.js"; // <--- ELIMINADO

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/hoja11")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error:", err));


function crudRoutes(model, name) {

  app.post(`/${name}`, async (req, res) => {
    const item = new model(req.body);
    await item.save();
    res.json(item);
  });


  app.get(`/${name}`, async (req, res) => {
    res.json(await model.find());
  });


  app.put(`/${name}/:id`, async (req, res) => {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  });

  app.get(`/${name}/buscar/:campo/:valor`, async (req, res) => {
    const filtro = {};
    filtro[req.params.campo] = req.params.valor;
    res.json(await model.find(filtro));
  });
}


crudRoutes(Encargado, "encargado");
crudRoutes(Proyecto, "proyecto");


app.listen(4000, () => console.log("🚀 Servidor backend en puerto 4000"));