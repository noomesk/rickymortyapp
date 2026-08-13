//Tmbn usa ShadowDOM 

/**
 * Componente que representa la tarjeta visual de un personaje de Rick & Morty.
 * Utiliza Shadow DOM para encapsular sus estilos y estructura, y carga su propio
 * archivo CSS de forma dinámica mediante fetch.
 *
 * @class CharacterCard
 * @extends HTMLElement
 */
class CharacterCard extends HTMLElement {
  /**
   * Inicializa el componente, crea el Shadow DOM y define las propiedades
   * internas que usará para guardar el personaje, su estado de favorito
   * y el CSS cargado.
   *
   * @constructor
   */
  constructor() {
    super(); // Inicializa la clase base HTMLElement
    this.attachShadow({ mode: 'open' }); // Crea el Shadow DOM del componente

    /**
     * Datos del personaje actualmente mostrado en la tarjeta.
     * @type {Object|null}
     */
    this.character = null; // aquí se va a guardar el personaje recibido

    /**
     * Indica si el personaje actual está marcado como favorito.
     * @type {boolean}
     */
    this.isFavorite = false; // nuevo: estado visual local de esta tarjeta *

    /**
     * Contenido CSS cargado desde el archivo externo, cacheado para evitar
     * múltiples peticiones fetch innecesarias.
     * @type {string}
     */
    this.cssText = ''; // aquí se va a guardar el CSS ya cargado :3 wii 
  }

  /**
   * Carga el archivo CSS externo del componente como texto plano usando fetch.
   * Si el CSS ya fue cargado previamente (cacheado en `this.cssText`), lo retorna
   * directamente sin volver a pedirlo.
   *
   * @async
   * @returns {Promise<string>} El contenido del archivo CSS como texto.
   */
  async loadStyles() {
    if (this.cssText) return this.cssText; // evita pedirlo de nuevo si ya lo tenemos
    const response = await fetch('/src/styles/CharacterCard.css'); //BUG** fetch('../styles/CharacterCard.css') no se está sirviendo bien la ruta: :5500/styles/CharacterCard.css FALTA src lokooo!
    this.cssText = await response.text();
    return this.cssText;
  }

  /**
   * Recibe los datos de un personaje y su estado de favorito, actualiza las
   * propiedades internas, renderiza la tarjeta y vuelve a enganchar los
   * event listeners (ya que el contenido del Shadow DOM se regenera en cada render).
   *
   * @async
   * @param {Object} character - Objeto con los datos del personaje (nombre, imagen, estado, etc.).
   * @param {boolean} [isFavorite=false] - Indica si el personaje debe mostrarse como favorito.
   * @returns {Promise<void>}
   */
  async setCharacter(character, isFavorite = false) { //le agregué favorite *
    this.character = character; // Guarda el personaje recibido
    this.isFavorite = isFavorite; //nueva con fav *
    await this.render(); // Actualiza la tarjeta con la nueva información // / ahora render es async porque espera el fetch del CSS
    this.setupEventListeners(); // hay que re-enganchar el listener cada render *
  }

  /**
   * Renderiza visualmente la tarjeta del personaje dentro del Shadow DOM,
   * incluyendo su imagen, nombre, estado, especie, origen, ubicación y
   * cantidad de episodios. Si no hay un personaje asignado, no renderiza nada.
   *
   * @async
   * @returns {Promise<void>}
   */
  async render() {
    if (!this.character) return;

     const { name, image, status, species, origin, location, episode } = this.character;
     const css = await this.loadStyles();

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <div class="card">
        <button class="fav-btn">${this.isFavorite ? '❤️' : '🤍'}</button>
        <img src="${image}" alt="${name}" />
        <h3>${name}</h3>
        <p>${status} - ${species}</p>
        <p><strong>Origen:</strong> ${origin?.name ?? 'Desconocido'}</p>
        <p><strong>Ubicación:</strong> ${location?.name ?? 'Desconocida'}</p>
        <p><strong>Episodios:</strong> ${episode?.length ?? 0}</p>
      </div>
    `;
  }

  /**
   * Configura el listener del botón de favoritos. Al hacer click, dispara
   * un evento personalizado 'toggle-favorite' que burbujea hacia arriba
   * (bubbles) y atraviesa los límites del Shadow DOM (composed), para que
   * pueda ser capturado por componentes ancestros como RickMortyApp.
   *
   * @returns {void}
   */
  setupEventListeners() {
    const favBtn = this.shadowRoot.querySelector('.fav-btn');
    
    favBtn.addEventListener('click', () => {
      const evento = new CustomEvent('toggle-favorite', {
        detail: { characterId: this.character.id, characterData: this.character },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(evento);
    });
  }
}

customElements.define('character-card', CharacterCard);