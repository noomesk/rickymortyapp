import { RickAndMortyService } from '../services/RickAndMortyService.js';

class RickMortyApp extends HTMLElement {
  constructor() {
    super();
    this.state = {
      status: 'idle',
      characters: [],
      favorites: this.loadFavorites(),
      errorMessage: ''
    };
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al leer favoritos de localStorage:', error);
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateFavoritesDisplay();
  }

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

  updateFavoritesDisplay() {
    const favList = this.querySelector('favorites-list');
    favList.setFavorites(this.state.favorites);
  }

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