const urlBase = "http://localhost:4000";
const coleccion = document.getElementById("coleccion");
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

coleccion.addEventListener("change", actualizarFormulario);
actualizarFormulario();

// 🔹 Cambia el formulario dependiendo de la colección seleccionada
// (MODIFICADO para añadir contenedores y botones dinámicos)
function actualizarFormulario() {
  const tipo = coleccion.value;

  if (tipo === "encargado") {
    formulario.innerHTML = `
      <h3>Encargado</h3>
      <div class="form-group">
        <label>Nombre</label>
        <input id="nombre" placeholder="Nombre">
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input id="direccion" placeholder="Dirección">
      </div>
      <div class="form-group">
        <label>DPI</label>
        <input id="dpi" placeholder="DPI">
      </div>
    `;
  } 
  
  else if (tipo === "proyecto") {
    formulario.innerHTML = `
      <h3>Proyecto</h3>
      <div class="form-group">
        <label>Nombre del Proyecto</label>
        <input id="nombre" placeholder="Nombre del Proyecto">
      </div>
      <div class="form-group">
        <label>Fecha de Inicio</label>
        <input id="fechaInicio" type="date">
      </div>
      <div class="form-group">
        <label>Fecha de Finalización</label>
        <input id="fechaFin" type="date">
      </div>
      <div class="form-group">
        <label>Presupuesto</label>
        <input id="presupuesto" type="number" placeholder="Presupuesto">
      </div>
      <div class="form-group">
        <label>Finalizado</label>
        <select id="finalizado">
          <option value="false">No</option>
          <option value="true">Sí</option>
        </select>
      </div>
      <div class="form-group">
        <label>ID del Encargado (opcional)</label>
        <input id="encargado" placeholder="ID del Encargado">
      </div>

      <hr>
      <h4>Servicios</h4>
      <div id="servicios-container">
        </div>
      <button type"button" class="btn-add" onclick="agregarServicio()">Añadir Servicio</button>
      <hr>

      <h4>Familias Beneficiadas</h4>
      <div id="familias-container">
        </div>
      <button type="button" class="btn-add" onclick="agregarFamilia()">Añadir Familia</button>
    `;
    
    // Añadir el primer bloque de cada uno
    agregarServicio();
    agregarFamilia();
  }
}

// ---------------------------------------------------
// NUEVAS FUNCIONES PARA FORMULARIOS DINÁMICOS
// ---------------------------------------------------

// NUEVA FUNCIÓN: Añade un bloque de campos de Servicio
function agregarServicio() {
  const container = document.getElementById("servicios-container");
  const div = document.createElement("div");
  div.className = "form-bloque servicio-bloque"; // Clase para agrupar y buscar
  div.innerHTML = `
    <div class="form-group">
      <label>Servicio</label>
      <input class="servicio-nombre" placeholder="Servicio">
    </div>
    <div class="form-group">
      <label>Precio</label>
      <input class="servicio-precio" type="number" placeholder="Precio">
    </div>
    <div class="form-group">
      <label>Cantidad</label>
      <input class="servicio-cantidad" type="number" placeholder="Cantidad">
    </div>
    <button type="button" class="btn-remove" onclick="removerElemento(this)">Quitar Servicio</button>
  `;
  container.appendChild(div);
}

// NUEVA FUNCIÓN: Añade un bloque de campos de Familia
function agregarFamilia() {
  const container = document.getElementById("familias-container");
  const div = document.createElement("div");
  div.className = "form-bloque familia-bloque";
  div.innerHTML = `
    <div class="form-group">
      <label>Dirección de la Familia</label>
      <input class="familia-direccion" placeholder="Dirección">
    </div>
    <div class="form-group">
      <label>Ingreso Mensual Familiar</label>
      <input class="familia-ingreso" type="number" placeholder="Ingreso Mensual">
    </div>
    
    <h5>Integrantes de esta familia</h5>
    <div class="integrantes-container">
      </div>
    <button type="button" class="btn-add-sub" onclick="agregarIntegrante(this)">Añadir Integrante</button>
    <button type="button" class="btn-remove" onclick="removerElemento(this)">Quitar Familia</button>
  `;
  container.appendChild(div);
  
  // Añadir el primer integrante a esta nueva familia
  agregarIntegrante(div.querySelector(".btn-add-sub"));
}

// NUEVA FUNCIÓN: Añade un bloque de campos de Integrante
function agregarIntegrante(boton) {
  // Encuentra el contenedor de integrantes más cercano (dentro de su bloque de familia)
  const container = boton.closest('.familia-bloque').querySelector('.integrantes-container');
  const div = document.createElement("div");
  div.className = "form-bloque integrante-bloque";
  div.innerHTML = `
    <div class="form-group-sub">
      <label>Nombre</label>
      <input class="integrante-nombre" placeholder="Nombre">
    </div>
    <div class="form-group-sub">
      <label>Apellido</label>
      <input class="integrante-apellido" placeholder="Apellido">
    </div>
    <div class="form-group-sub">
      <label>Edad</label>
      <input class="integrante-edad" type="number" placeholder="Edad">
    </div>
    <button type="button" class="btn-remove-sub" onclick="removerElemento(this)">Quitar Integrante</button>
  `;
  container.appendChild(div);
}

// NUEVA FUNCIÓN: Remueve el bloque de formulario padre (servicio, familia o integrante)
function removerElemento(boton) {
  boton.closest('.form-bloque').remove();
}

// ---------------------------------------------------
// FUNCIONES CRUD
// ---------------------------------------------------

// 🔹 Construye el objeto según el tipo
// (MODIFICADO para leer los campos dinámicos con bucles)
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
    
    // --- Leer Servicios Dinámicos ---
    const servicios = [];
    document.querySelectorAll("#servicios-container .servicio-bloque").forEach(bloque => {
      const servicioNombre = bloque.querySelector(".servicio-nombre").value;
      const precio = parseFloat(bloque.querySelector(".servicio-precio").value) || 0;
      const cantidad = parseFloat(bloque.querySelector(".servicio-cantidad").value) || 0;
      
      if (servicioNombre) { // Solo añadir si tiene nombre
        servicios.push({
          servicio: servicioNombre,
          precio: precio,
          cantidad: cantidad,
          subtotal: precio * cantidad
        });
      }
    });

    // --- Leer Familias Dinámicas (y sus Integrantes anidados) ---
    const familias = [];
    document.querySelectorAll("#familias-container .familia-bloque").forEach(bloqueFamilia => {
      const direccion = bloqueFamilia.querySelector(".familia-direccion").value;
      const ingreso = parseFloat(bloqueFamilia.querySelector(".familia-ingreso").value) || 0;

      // --- Leer Integrantes Dinámicos (bucle anidado) ---
      const integrantes = [];
      bloqueFamilia.querySelectorAll(".integrante-bloque").forEach(bloqueIntegrante => {
        const nombre = bloqueIntegrante.querySelector(".integrante-nombre").value;
        const apellido = bloqueIntegrante.querySelector(".integrante-apellido").value;
        const edad = parseInt(bloqueIntegrante.querySelector(".integrante-edad").value) || 0;
        
        if (nombre) { // Solo añadir si tiene nombre
          integrantes.push({
            nombre: nombre,
            apellido: apellido,
            edad: edad
          });
        }
      });

      if (direccion) { // Solo añadir familia si tiene dirección
        familias.push({
          direccion: direccion,
          ingresoMensual: ingreso,
          integrantes: integrantes
        });
      }
    });

    // --- Construir el objeto Proyecto final ---
    datos = {
      nombre: document.getElementById("nombre").value,
      fechaInicio: document.getElementById("fechaInicio").value,
      fechaFin: document.getElementById("fechaFin").value,
      presupuesto: parseFloat(document.getElementById("presupuesto").value) || 0,
      finalizado: document.getElementById("finalizado").value === "true",
      encargado: document.getElementById("encargado").value || null,
      servicios: servicios,
      familiasBeneficiadas: familias
    };
  } 

  return datos;
}

// 🔹 Funciones CRUD (SIN CAMBIOS, PERO RE-INCLUIDAS PARA CONTEXTO)
async function insertar() {
  const tipo = coleccion.value;
  const datos = obtenerDatosFormulario();
  
  // Limpiar campos vacíos antes de enviar
  if (datos.encargado === null) delete datos.encargado;

  const res = await fetch(`${urlBase}/${tipo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  const json = await res.json();
  resultado.textContent = JSON.stringify(json, null, 2);
}

async function mostrar() {
  const tipo = coleccion.value;
  const res = await fetch(`${urlBase}/${tipo}`);
  const json = await res.json();
  resultado.textContent = JSON.stringify(json, null, 2);
}

async function buscar() {
  const tipo = coleccion.value;
  const id = document.getElementById("idBuscar").value;
  
  const res = await fetch(`${urlBase}/${tipo}`); 
  const todos = await res.json();
  const encontrado = todos.find(item => item._id === id);
  
  resultado.textContent = encontrado
    ? JSON.stringify(encontrado, null, 2)
    : "No se encontró ningún documento con ese ID.";
}

async function actualizar() {
  const tipo = coleccion.value;
  const id = document.getElementById("idBuscar").value;
  if (!id) {
    resultado.textContent = "Por favor, ingrese un ID para actualizar.";
    return;
  }
  
  const datos = obtenerDatosFormulario();
  if (datos.encargado === null) delete datos.encargado;

  const res = await fetch(`${urlBase}/${tipo}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  const json = await res.json();
  resultado.textContent = JSON.stringify(json, null, 2);
}