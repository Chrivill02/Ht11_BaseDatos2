import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Encargado from "./models/Encargado.js";
import Proyecto from "./models/Proyecto.js";
import Familia from "./models/Familia.js";

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (usa tu propio URI o MongoDB local)
mongoose.connect("mongodb://localhost:27017/hoja11")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error:", err));

// Función para crear rutas CRUD genéricas
function crudRoutes(model, name) {
  // Insertar
  app.post(`/${name}`, async (req, res) => {
    const item = new model(req.body);
    await item.save();
    res.json(item);
  });

  // Mostrar todos
  app.get(`/${name}`, async (req, res) => {
    res.json(await model.find());
  });

  // Actualizar por ID
  app.put(`/${name}/:id`, async (req, res) => {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  });

  // Buscar por campo/valor
  app.get(`/${name}/buscar/:campo/:valor`, async (req, res) => {
    const filtro = {};
    filtro[req.params.campo] = req.params.valor;
    res.json(await model.find(filtro));
  });
}

// Crear rutas para las 3 colecciones
crudRoutes(Encargado, "encargado");
crudRoutes(Proyecto, "proyecto");
crudRoutes(Familia, "familia");

app.listen(4000, () => console.log("🚀 Servidor backend en puerto 4000"));
