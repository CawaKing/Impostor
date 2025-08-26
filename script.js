let numJugadores, numImpostores;
let palabraElegida = "Messi"; // luego se puede hacer aleatorio con categorías
let impostores = [];
let jugadorActual = 1;

const inicio = document.getElementById("inicio");
const roles = document.getElementById("roles");
const finalPantalla = document.getElementById("final");

const iniciarBtn = document.getElementById("iniciarBtn");
const mostrarRolBtn = document.getElementById("mostrarRolBtn");
const siguienteJugadorBtn = document.getElementById("siguienteJugadorBtn");
const volverInicioBtn = document.getElementById("volverInicioBtn");

const jugadorTitulo = document.getElementById("jugadorTitulo");
const rolTexto = document.getElementById("rolTexto");

iniciarBtn.addEventListener("click", () => {
  numJugadores = parseInt(document.getElementById("numJugadores").value);
  numImpostores = parseInt(document.getElementById("numImpostores").value);

  if (numJugadores < 3 || numJugadores > 150) {
    alert("El número de jugadores debe estar entre 3 y 150");
    return;
  }

  if (numImpostores < 1 || numImpostores > 6) {
    alert("El número de impostores debe estar entre 1 y 6");
    return;
  }

  if (numImpostores >= numJugadores) {
    alert("Los impostores deben ser menos que los jugadores");
    return;
  }

  // Generar impostores aleatorios
  impostores = [];
  while (impostores.length < numImpostores) {
    let rand = Math.floor(Math.random() * numJugadores) + 1;
    if (!impostores.includes(rand)) impostores.push(rand);
  }

  inicio.classList.remove("activa");
  roles.classList.add("activa");

  jugadorActual = 1;
  actualizarJugador();
});

function actualizarJugador() {
  jugadorTitulo.textContent = "Jugador " + jugadorActual;
  rolTexto.textContent = "";
  mostrarRolBtn.style.display = "inline-block";
  siguienteJugadorBtn.style.display = "none";
}

mostrarRolBtn.addEventListener("click", () => {
  if (impostores.includes(jugadorActual)) {
    rolTexto.textContent = "Eres el IMPOSTOR 👀";
  } else {
    rolTexto.textContent = "La palabra es: " + palabraElegida;
  }
  mostrarRolBtn.style.display = "none";
  siguienteJugadorBtn.style.display = "inline-block";
});

siguienteJugadorBtn.addEventListener("click", () => {
  jugadorActual++;
  if (jugadorActual > numJugadores) {
    roles.classList.remove("activa");
    finalPantalla.classList.add("activa");
  } else {
    actualizarJugador();
  }
});

volverInicioBtn.addEventListener("click", () => {
  finalPantalla.classList.remove("activa");
  inicio.classList.add("activa");
});
