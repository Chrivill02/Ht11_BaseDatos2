const urlBase = "http://localhost:4000";
const coleccion = document.getElementById("coleccion");
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

coleccion.addEventListener("change", actualizarFormulario);
actualizarFormulario();

// 🔹 Cambia el formulario dependiendo de la colección
function actualizarFormulario() {
  const tipo = coleccion.value;

  if (tipo === "encargado") {
    formulario.innerHTML = `
      <h3>Encargado</h3>
      <input id="nombre" placeholder="Nombre">
      <input id="direccion" placeholder="Dirección">
      <input id="dpi" placeholder="DPI">
    `;
  } 
  else if (tipo === "proyecto") {
    formulario.innerHTML = `
      <h3>Proyecto</h3>
      <input id="nombre" placeholder="Nombre del Proyecto">
      <input id="fechaInicio" type="date">
      <input id="fechaFin" type="date">
      <input id="presupuesto" type="number" placeholder="Presupuesto">
      <label>Finalizado:</label>
      <select id="finalizado">
        <option value="false">No</option>
        <option value="true">Sí</option>
      </select>
      <input id="encargado" placeholder="ID del Encargado (opcional)">
      <h4>Servicio (opcional)</h4>
      <input id="servicio1" placeholder="Servicio">
      <input id="precio1" type="number" placeholder="Precio">
      <input id="cantidad1" type="number" placeholder="Cantidad">
    `;
  } 
  else if (tipo === "familia") {
    formulario.innerHTML = `
      <h3>Familia Beneficiada</h3>
      <input id="direccion" placeholder="Dirección">
      <input id="ingresoMensual" type="number" placeholder="Ingreso Mensual">
      <input id="proyecto" placeholder="ID del Proyecto (opcional)">
      <h4>Integrante</h4>
      <input id="nombre1" placeholder="Nombre">
      <input id="apellido1" placeholder="Apellido">
      <input id="edad1" type="number" placeholder="Edad">
    `;
  }
}

// 🔹 Construye el objeto según el tipo
function obtenerDatosFormulario() {
  const tipo = coleccion.value;
  let datos = {};

  if (tipo === "encargado") {
    datos = {
      nombre: document.getElementById("nombre").value,
      direccion: document.getElementById("direccion").value,
      dpi: document.getElementById("dpi").value
    };
  } 
  else if (tipo === "proyecto") {
    datos = {
      nombre: document.getElementById("nombre").value,
      fechaInicio: document.getElementById("fechaInicio").value,
      fechaFin: document.getElementById("fechaFin").value,
      presupuesto: parseFloat(document.getElementById("presupuesto").value),
      finalizado: document.getElementById("finalizado").value === "true",
      encargado: document.getElementById("encargado").value || null,
      servicios: [{
        servicio: document.getElementById("servicio1").value,
        precio: parseFloat(document.getElementById("precio1").value) || 0,
        cantidad: parseFloat(document.getElementById("cantidad1").value) || 0,
        subtotal: (parseFloat(document.getElementById("precio1").value) || 0) *
                  (parseFloat(document.getElementById("cantidad1").value) || 0)
      }]
    };
  } 
  else if (tipo === "familia") {
    datos = {
      direccion: document.getElementById("direccion").value,
      ingresoMensual: parseFloat(document.getElementById("ingresoMensual").value),
      proyecto: document.getElementById("proyecto").value || null,
      integrantes: [{
        nombre: document.getElementById("nombre1").value,
        apellido: document.getElementById("apellido1").value,
        edad: parseInt(document.getElementById("edad1").value)
      }]
    };
  }

  return datos;
}

// 🔹 Insertar
async function insertar() {
  const tipo = coleccion.value;
  const datos = obtenerDatosFormulario();

  const res = await fetch(`${urlBase}/${tipo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  const json = await res.json();
  resultado.textContent = JSON.stringify(json, null, 2);
}

// 🔹 Mostrar todos
async function mostrar() {
  const tipo = coleccion.value;
  const res = await fetch(`${urlBase}/${tipo}`);
  const json = await res.json();
  resultado.textContent = JSON.stringify(json, null, 2);
}

// 🔹 Buscar por ID
async function buscar() {
  const tipo = coleccion.value;
  const id = document.getElementById("idBuscar").value;

  const res = await fetch(`${urlBase}/${tipo}`);
  const todos = await res.json();
  const encontrado = todos.find(item => item._id === id);

  if (encontrado) {
    resultado.textContent = JSON.stringify(encontrado, null, 2);
  } else {
    resultado.textContent = "No se encontró ningún documento con ese ID.";
  }
}

// 🔹 Actualizar por ID
async function actualizar() {
  const tipo = coleccion.value;
  const id = document.getElementById("idBuscar").value;
  const datos = obtenerDatosFormulario();

  const res = await fetch(`${urlBase}/${tipo}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  const json = await res.json();
  resultado.textContent = JSON.stringify(json, null, 2);
}
