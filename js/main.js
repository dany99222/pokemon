// ==========================
//  MENU RESPONSIVE
// ==========================
const logo = document.querySelector(".logo-pokedex");
const navLista = document.querySelector(".nav-list");
const contenedorImg = document.querySelector(".imagenes");

logo.addEventListener("click", function () {
  navLista.classList.toggle("hidden");
  contenedorImg.classList.toggle("flex");

});

// ==========================
//  VARIABLES GLOBALES
// ==========================
const listaPokemon = document.querySelector("#listaPokemon");
const botonesNav = document.querySelectorAll(".btn-header");

let url = "https://pokeapi.co/api/v2/pokemon/";
let offset = 1; // Empezamos desde el Pokémon 1
const limit = 15; // Cargamos 15 Pokémon por bloque
const maxPokemon = 1025; // Total de Pokémon disponibles
let modoFiltro = false; //  control de estado

// ==========================
//  FUNCIONES
// ==========================

// Cargar un bloque de Pokémon
function cargarPokemon() {

  if (modoFiltro) return; //  Si estamos en filtro, no cargar más
  if (offset > maxPokemon) return;

  for (let i = offset; i < offset + limit && i <= maxPokemon; i++) {
    fetch(url + i)
      .then((response) => response.json())
      .then((data) => mostrarPokemon(data));
  }

  offset += limit;
}

// Mostrar Pokémon en el DOM
function mostrarPokemon(data) {
  const divpokemon = document.createElement("div");
  divpokemon.classList.add("pokemon");

  // Tipos dinámicos
  const tipos = data.types
    .map(
      (t) => `<p class="tipo ${t.type.name}">${t.type.name.toUpperCase()}</p>`
    )
    .join("");

  // ID con 3 dígitos
  const idFormateado = String(data.id).padStart(3, "0");

  divpokemon.innerHTML = `
    <p class="pokemon-id-back">#${idFormateado}</p>
    <div class="pokemon-imagen">
      <img
        src="${data.sprites.other["official-artwork"]["front_default"]}"
        alt="${data.name}"
      />
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">#${idFormateado}</p>
        <h2 class="pokemon-nombre">${data.name}</h2>
      </div>
      <div class="pokemon-tipos">${tipos}</div>
      <div class="pokemon-stats">
        <p class="stat">${data.height / 10}m</p>
        <p class="stat">${data.weight / 10}kg</p>
      </div>
    </div>
  `;

  listaPokemon.append(divpokemon);
}

// ==========================
//  EVENTOS
// ==========================

// Filtros por tipo y botón "Ver todos"
botonesNav.forEach((boton) =>
  boton.addEventListener("click", (e) => {
    const botonId = e.currentTarget.id;
    listaPokemon.innerHTML = "";

    if (botonId === "ver-todos") {
      //  Modo normal
      offset = 1;
      modoFiltro = false;
      cargarPokemon();
    } else {
      //  Modo filtro
      modoFiltro = true;
      fetch(`https://pokeapi.co/api/v2/type/${botonId}`)
        .then((res) => res.json())
        .then((data) => {
          data.pokemon.forEach((poke) => {
            fetch(poke.pokemon.url)
              .then((res) => res.json())
              .then((pokeData) => mostrarPokemon(pokeData));
          });
        });
    }
  })
);

// Scroll infinito
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 30) {
    cargarPokemon();
  }
});

// ==========================
//  INICIO
// ==========================

// Cargar los primeros Pokémon
cargarPokemon();

const btnTop = document.querySelector("#btn-top");

// Mostrar/ocultar botón al hacer scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    btnTop.style.display = "block";
  } else {
    btnTop.style.display = "none";
  }
});

// Al hacer click, volver al inicio suavemente
btnTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Inicialmente oculto
btnTop.style.display = "none";


// ==========================
//  Buscar pokemones
// ==========================

const inputBuscar = document.querySelector("#buscarPokemon");


inputBuscar.addEventListener("input", () => {
  const query = inputBuscar.value.toLowerCase();
  const pokemones = document.querySelectorAll(".pokemon");

  pokemones.forEach((poke) => {
    const nombre = poke.querySelector(".pokemon-nombre").textContent.toLowerCase();
    if (nombre.includes(query)) {
      poke.style.display = "block"; // se muestra
    } else {
      poke.style.display = "none";  // se oculta
    }
  });
});
