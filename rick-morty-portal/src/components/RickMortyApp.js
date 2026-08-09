// Este componente no usa: Shadow DOM  
import { RickAndMortyService } from '../services/RickAndMortyService.js';
// Trae la clase del servicio para poder usarla aquí. Sin esta línea,
// "RickAndMortyService" no existiría en este archivo.

class RickMortyApp extends HTMLElement { // Hereda todo el comportamiento base de un elemento HTML nativo.
  constructor() {
    super(); // Obligatorio: inicializa primero la parte de HTMLElement antes de add comportamiendo propio
    // Estado global de la aplicación — vive SOLO aquí (RA-02)
    this.state = {
      status: 'idle',       // 'idle' | 'loading' | 'success' | 'error'
      characters: [],
      favorites: this.loadFavorites(), // lee desde localStorage al iniciar ** pa persistencia de datos
      errorMessage: ''
    };
    // El "cerebro" de toda la app. Es el ÚNICO lugar donde vive el 
    // estado global (RA-02). Todo lo que la app "sabe" en un momento 
    // dado está aquí: si está cargando, qué personajes tiene, cuáles 
    // son favoritos, y si hubo un error wii 
  }
//nuevo favoritos para localStorage: -----------------------------------
  loadFavorites() {
  try {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error al leer favoritos de localStorage:', error);
    return []; // si algo está corrupto, no c rompe la app, c empieza limpio (c devuelve en un array vacio)
  
  }
}

saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
}

//--------------------------------------------------------------------------
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Se ejecuta automáticamente cuando <rick-morty-app> aparece en 
    // el documento. Primero pinta el HTML inicial, luego activa los 
    // "oídos" del componente (los listeners).
    this.updateFavoritesDisplay(); // muestra favoritos guardados desde el arranque :3 q emociónnn!
  }

  render() {
    // Por ahora, renderizado simple sin Shadow DOM en el contenedor raíz
    // (RickMortyApp NO necesita Shadow DOM según nuestros requerimientos —
    // solo CharacterCard y SearchFilters lo requieren, RT-02)
    
    // LE VOA PONER TÍTULO A LA PÁGINA: 
    this.innerHTML = ` 
      <header class="app-header">
        <h1>Rick & Morty Portal</h1> 
      </header>
      <search-filters></search-filters>
      <favorites-list></favorites-list>
      <div class="app-status"></div>
      <div class="results-container"></div>
  `;
    // Crea la estructura base: el buscador, un espacio para mensajes 
    // de estado (Cargando/Error/Éxito), y un contenedor vacío donde 
    // van a aparecer las tarjetas. Usa this.innerHTML (no shadowRoot) 
    // porque RickMortyApp no tiene Shadow DOM.
  }

  setupEventListeners() {
    this.addEventListener('search-submitted', (event) => {
      const { query, status } = event.detail;
      this.handleSearch(query, status);
    });
    // Aquí es literalmente "el director escuchando a su músico". 
    // Cuando SearchFilters grita 'search-submitted', RickMortyApp 
    // lo escucha, extrae el payload (query, status), y decide qué 
    // hacer: llamar a handleSearch.

//nuevo, para el btn de favortios: 
    this.addEventListener('toggle-favorite', (event) => {
    const { characterId, characterData } = event.detail;
    this.toggleFavorite(characterId, characterData);
  });

//nuevo evento remove-favorite en setupEventListeners() para ecuchar el btn fav
    this.addEventListener('remove-favorite', (event) => {
    const { characterId } = event.detail;
    this.state.favorites = this.state.favorites.filter(fav => fav.id !== characterId);
    this.saveFavorites(); // nuevo para LocalStorage 
    this.updateFavoritesDisplay();
    this.updateStatusDisplay(); // para que los corazones de las tarjetas se actualicen también MEUEJJE
});

  }

  toggleFavorite(characterId, characterData) {
  const existe = this.state.favorites.some(fav => fav.id === characterId);


  if (existe) {
    this.state.favorites = this.state.favorites.filter(fav => fav.id !== characterId);
  } else {
    // Modelo Favorite reducido, siguiendo la regla d cuando c definió en el Sprint 0
    this.state.favorites.push({
      id: characterData.id,
      name: characterData.name,
      image: characterData.image
    });
  }

  this.saveFavorites(); // nuevo para localStorage jehajej
  this.updateFavoritesDisplay(); //para actualizar las de favs
  this.updateStatusDisplay(); // re-renderiza para reflejar el corazón actualizado

}

  async handleSearch(query, status) {
    this.state.status = 'loading';
    this.updateStatusDisplay();
    // Apenas se inicia la búsqueda, cambia el estado a "loading" 
    // y refleja eso en pantalla INMEDIATAMENTE (por eso c ve en pantalla
    //  "Cargando..." aunque sea muy rápido).

    try {  //SE PUEDE ENCAPSULAR**
      const data = await RickAndMortyService.getCharacters(query, status);
      this.state.characters = data.results;
      this.state.status = 'success';
      console.table(this.state.characters);
      // Le pide los datos al servicio (el "mesero" yendo a la 
      // "cocina"). Si todo sale bien, guarda los personajes en el 
      // estado y marca "success". El console.table es solo para 
      // que io verifique visualmente en consola (esto se puede quitar más adelante, es debug muajaj).
    } catch (error) {
      this.state.status = 'error';
      this.state.errorMessage = error.message;
      // Si algo sale mal (API caída, sin resultados, etc.), captura 
      // el error y lo guarda en el estado para poder mostrarlo.
    }

    this.updateStatusDisplay();
        // Sin importar si hubo éxito o error, siempre se actualiza 
        // la pantalla al final con el estado más reciente.
  }

updateStatusDisplay() {
  const statusDiv = this.querySelector('.app-status');
  const resultsDiv = this.querySelector('.results-container');
    // Busca las dos "cajas vacías" las q se crearon en el render(app-status (cargando...) 
    // y results-container (tarjetas con personajes)) que ya existen en el DOM para poder modificarlas
  
  resultsDiv.innerHTML = ''; // limpiar resultados anteriores
    // Limpia cualquier tarjeta anterior ANTES de mostrar los 
    // nuevos resultados. Sin esto, cada búsqueda ACUMULARÍA 
    // tarjetas viejas junto a las nuevas.

  if (this.state.status === 'loading') { // esta variable puede tener diferentes valores: 'idle', 'loading', 'success', 'error', el if solo pregunta en q valor está
   // ¿La aplicación está cargando datos?, si this.state.status es = a loading entra:
    statusDiv.textContent = 'Cargando...'; // Muestra el mensaje de carga al usuario 
  } else if (this.state.status === 'success') { // Si no era loading, pregunta: ¿La búsqueda terminó correctamente?
    statusDiv.textContent = `Se encontraron ${this.state.characters.length} personajes`; //cantidad de persn encontrados: zb: Se encontraron 20 personajes
    this.renderCharacters(); // Crea y muestra las tarjetas de los personajes***
    // Solo si hay éxito, además del texto, se llama a renderCharacters() 
    // para pintar las tarjetas reales. 
  } else if (this.state.status === 'error') { //Si tampoco era "success", pregunta: ¿Ocurrió un error durante la búsqueda?
    statusDiv.textContent = `Error: ${this.state.errorMessage}`; // Muestra el mensaje del error
  }
}

//nuevo método pa mantener actualizada la parte de favoritos amiga:
updateFavoritesDisplay() {
  const favList = this.querySelector('favorites-list');
  favList.setFavorites(this.state.favorites);
}

//---------------------------------------------------------------

renderCharacters() { // este método solo ocurre si: else if (this.state.status === 'success') usuario buscó y la API respondió
  const resultsDiv = this.querySelector('.results-container'); // Busca el contenedor donde se van a insertar las tarjetas
  //en render (), habia puesto: <div class="results-container"></div> estaba vacio, busca ese contenedor (se llena con character-card></character-card> dependiendo cuantas son jej)
  const fragment = document.createDocumentFragment(); // Un fragment es una caja temporal invisible
  // Crea un contenedor temporal en memoria para guardar las tarjetas antes de agregarlas al DOM

  this.state.characters.forEach((character) => {  // Recorre cada personaje que llegó desde la API (basicamente dice: por cada personaje que tengo, haz esto)
    const card = document.createElement('character-card'); // // Crea un nuevo componente desde js: <character-card></character-card>
    const isFavorite = this.state.favorites.some(fav => fav.id === character.id); //* nuevo, para favoritos
    card.setCharacter(character, isFavorite); // Le entrega los datos del personaje al componente CharacterCard (Aquí ocurre la comunicación entre componentes muajaja)
    fragment.appendChild(card); // Agrega la tarjeta creada al fragmento temporal (la guarda temporalmente) todavia no son visibles, estan esperanding...
  });

  resultsDiv.appendChild(fragment);  // Inserta todas las tarjetas juntas dentro del DOM (Finalmente mostrar todo en la página) lo q esta dentro de: <div class="results-container"></div>
  }
}

customElements.define('rick-morty-app', RickMortyApp); // crear una instancia de la clase RickMortyApp
// y ejecutar sus métodos:
//- constructor()
//- connectedCallback()
//- render()
//- setupEventListeners()