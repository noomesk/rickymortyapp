class FavoritesList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.favorites = [];
  }

  setFavorites(favorites) {
    this.favorites = favorites;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .favorites-container {
          position: fixed;
          top: 10px;
          right: 10px;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          max-width: 220px;
          max-height: 300px;
          overflow-y: auto;
        }
        .fav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .fav-item img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .remove-btn {
          margin-left: auto;
          cursor: pointer;
          border: none;
          background: none;
        }
      </style>

      <div class="favorites-container">
        <h4>Favoritos (${this.favorites.length})</h4>
        ${this.favorites.map(fav => `
          <div class="fav-item" data-id="${fav.id}">
            <img src="${fav.image}" alt="${fav.name}" />
            <span>${fav.name}</span>
            <button class="remove-btn" data-id="${fav.id}">❌</button>
          </div>
        `).join('')}
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const container = this.shadowRoot.querySelector('.favorites-container');

    // DELEGACIÓN: un solo listener en el contenedor padre, para q escuche el boton
    // no uno por cada botón individual, y cuando alguien haga clic suba con bubble para saber cual fue eeeeeej
    container.addEventListener('click', (event) => {
      const btn = event.target.closest('.remove-btn');
      if (!btn) return; // si el clic no fue en un botón de quitar, ignora

      const characterId = Number(btn.dataset.id);

      const evento = new CustomEvent('remove-favorite', {
        detail: { characterId },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(evento);
    });
  }
}

customElements.define('favorites-list', FavoritesList);