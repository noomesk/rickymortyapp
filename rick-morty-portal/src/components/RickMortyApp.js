import { RickAndMortyService } from '../services/RickAndMortyService.js';

/**
 * Componente principal de la aplicación Rick & Morty.
 * Gestiona el estado global de la app, incluyendo la búsqueda de personajes,
 * el manejo de favoritos (con persistencia en localStorage) y la renderización
 * de los distintos estados de la UI (carga, éxito, error).
 *
 * @class RickMortyApp
 * @extends HTMLElement
 */
class RickMortyApp extends HTMLElement {
  /**
   * Crea una instancia de RickMortyApp e inicializa el estado interno.
   * El estado incluye el status de la búsqueda, los personajes obtenidos,
   * los favoritos cargados desde localStorage y el mensaje de error (si aplica).
   *
   * @constructor
   */
  constructor() {
    super();

    /**
     * Estado interno del componente.
     * @type {Object}
     * @property {'idle'|'loading'|'success'|'error'} status - Estado actual de la búsqueda.
     * @property {Array<Object>} characters - Lista de personajes obtenidos de la API.
     * @property {Array<{id: number, name: string, image: string}>} favorites - Lista de personajes favoritos.
     * @property {string} errorMessage - Mensaje de error en caso de fallo en la búsqueda.
     */
    this.state = {
      status: 'idle',
      characters: [],
      favorites: this.loadFavorites(),
      errorMessage: ''
    };
  }

  /**
   * Carga la lista de favoritos almacenada en localStorage.
   * Si no existe o hay un error al parsear, retorna un array vacío.
   *
   * @returns {Array<{id: number, name: string, image: string}>} Lista de favoritos cargados.
   */
  loadFavorites() {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al leer favoritos de localStorage:', error);
      return [];
    }
  }

  /**
   * Guarda la lista actual de favoritos en localStorage.
   *
   * @returns {void}
   */
  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
  }

  /**
   * Callback del ciclo de vida de Custom Elements.
   * Se ejecuta cuando el elemento es insertado en el DOM.
   * Renderiza la estructura inicial, configura los listeners de eventos
   * y actualiza la vista de favoritos.
   *
   * @returns {void}
   */
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateFavoritesDisplay();
  }

  /**
   * Renderiza la estructura HTML base de la aplicación,
   * incluyendo el header, los componentes de búsqueda, favoritos
   * y los contenedores de estado y resultados.
   *
   * @returns {void}
   */
  render() {
    this.innerHTML = `
      <header class="app-header">
        <h1>Rick & Morty Portal</h1>
      </header>
      <search-filters></search-filters>
      <favorites-list></favorites-list>
      <div class="app-status"></div>
      <div class="results-container"></div>
    `;
  }

  /**
   * Configura los listeners de eventos personalizados que maneja la aplicación:
   * - 'search-submitted': dispara una búsqueda de personajes.
   * - 'toggle-favorite': añade o elimina un personaje de favoritos.
   * - 'remove-favorite': elimina un personaje específico de favoritos.
   *
   * @returns {void}
   */
  setupEventListeners() {
    this.addEventListener('search-submitted', (event) => {
      const { query, status } = event.detail;
      this.handleSearch(query, status);
    });

    this.addEventListener('toggle-favorite', (event) => {
      const { characterId, characterData } = event.detail;
      this.toggleFavorite(characterId, characterData);
    });

    this.addEventListener('remove-favorite', (event) => {
      const { characterId } = event.detail;
      this.state.favorites = this.state.favorites.filter(fav => fav.id !== characterId);
      this.saveFavorites();
      this.updateFavoritesDisplay();
      this.updateStatusDisplay();
    });
  }

  /**
   * Añade o elimina un personaje de la lista de favoritos según si ya existe.
   * Actualiza el localStorage y refresca las vistas de favoritos y estado.
   *
   * @param {number} characterId - ID del personaje a alternar en favoritos.
   * @param {{id: number, name: string, image: string}} characterData - Datos del personaje.
   * @returns {void}
   */
  toggleFavorite(characterId, characterData) {
    const existe = this.state.favorites.some(fav => fav.id === characterId);

    if (existe) {
      this.state.favorites = this.state.favorites.filter(fav => fav.id !== characterId);
    } else {
      this.state.favorites.push({
        id: characterData.id,
        name: characterData.name,
        image: characterData.image
      });
    }

    this.saveFavorites();
    this.updateFavoritesDisplay();
    this.updateStatusDisplay();
  }

  /**
   * Realiza una búsqueda de personajes usando el servicio RickAndMortyService.
   * Actualiza el estado de la aplicación según el resultado (loading, success o error).
   *
   * @async
   * @param {string} query - Texto de búsqueda (nombre del personaje).
   * @param {string} status - Filtro de estado del personaje (alive, dead, unknown).
   * @returns {Promise<void>}
   */
  async handleSearch(query, status) {
    this.state.status = 'loading';
    this.updateStatusDisplay();

    try {
      const data = await RickAndMortyService.getCharacters(query, status);
      this.state.characters = data.results;
      this.state.status = 'success';
    } catch (error) {
      this.state.status = 'error';
      this.state.errorMessage = error.message;
    }

    this.updateStatusDisplay();
  }

  /**
   * Actualiza la sección de estado y resultados en el DOM según el estado actual
   * de la aplicación ('loading', 'success' o 'error').
   *
   * @returns {void}
   */
  updateStatusDisplay() {
    const statusDiv = this.querySelector('.app-status');
    const resultsDiv = this.querySelector('.results-container');

    resultsDiv.innerHTML = '';

    if (this.state.status === 'loading') {
      statusDiv.textContent = 'Cargando...';
    } else if (this.state.status === 'success') {
      statusDiv.textContent = `Se encontraron ${this.state.characters.length} personajes`;
      this.renderCharacters();
    } else if (this.state.status === 'error') {
      statusDiv.textContent = `Error: ${this.state.errorMessage}`;
    }
  }

  /**
   * Actualiza el componente 'favorites-list' con la lista actual de favoritos.
   *
   * @returns {void}
   */
  updateFavoritesDisplay() {
    const favList = this.querySelector('favorites-list');
    favList.setFavorites(this.state.favorites);
  }

  /**
   * Renderiza las tarjetas de personajes ('character-card') en el contenedor de resultados,
   * marcando cada una como favorita o no según corresponda.
   *
   * @returns {void}
   */
  renderCharacters() {
    const resultsDiv = this.querySelector('.results-container');
    const fragment = document.createDocumentFragment();

    this.state.characters.forEach((character) => {
      const card = document.createElement('character-card');
      const isFavorite = this.state.favorites.some(fav => fav.id === character.id);
      card.setCharacter(character, isFavorite);
      fragment.appendChild(card);
    });

    resultsDiv.appendChild(fragment);
  }
}

customElements.define('rick-morty-app', RickMortyApp);