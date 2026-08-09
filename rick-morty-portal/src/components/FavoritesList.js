class FavoritesList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.favorites = [];
    this.cssText = ''; // nuevo para FavoriteList muejej 
    this.setupEventListeners(); // se registra UNA sola vez, aquí (para DELEGACIÓN y reutilizarlo en cada render() jej)
  }

    // DELEGACIÓN: un solo listener en el contenedor padre, para q escuche el boton
    // no uno por cada botón individual, y cuando alguien haga clic suba con bubble para saber cual fue eeeeeej

setupEventListeners() {
  this.shadowRoot.addEventListener('click', (event) => {
    const btn = event.target.closest('.remove-btn');
    if (!btn) return;

    const characterId = Number(btn.dataset.id);

    const evento = new CustomEvent('remove-favorite', {
      detail: { characterId },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(evento);
  });
}

// Nuevo: trae el archivo .css como texto plano usando fetch, (q ya lo habia usado en charactercard.js jejhe)
   async loadStyles() {
    if (this.cssText) return this.cssText;
    const response = await fetch('/src/styles/FavoritesList.css');
    this.cssText = await response.text();
    return this.cssText;
  }  

  async setFavorites(favorites) { // le puse async await 
    this.favorites = favorites;
    await this.render();
  }

  async render() {  //aki tmbn le puse async await 
    const css = await this.loadStyles(); //nueva de style FavoriteList 
// aqui le cambio los estilos, por los nuevos con css:
    this.shadowRoot.innerHTML = `
      <style>${css}</style>

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

  }

}

customElements.define('favorites-list', FavoritesList);