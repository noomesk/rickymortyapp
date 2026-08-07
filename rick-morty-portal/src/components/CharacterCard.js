//Tmbn usa ShadowDOM 
class CharacterCard extends HTMLElement {
  constructor() {
    super(); // Inicializa la clase base HTMLElement
    this.attachShadow({ mode: 'open' }); // Crea el Shadow DOM del componente
    this.character = null; // aquí se va a guardar el personaje recibido
    this.isFavorite = false; // nuevo: estado visual local de esta tarjeta *
    this.cssText = ''; // aquí se va a guardar el CSS ya cargado :3 wii 
  }
// Nuevo: trae el archivo .css como texto plano usando fetch, (q ya lo habia usado en el service)
  async loadStyles() {
    if (this.cssText) return this.cssText; // evita pedirlo de nuevo si ya lo tenemos
    const response = await fetch('/src/styles/CharacterCard.css'); //BUG** fetch('../styles/CharacterCard.css') no se está sirviendo bien la ruta: :5500/styles/CharacterCard.css FALTA src lokooo!
    this.cssText = await response.text();
    return this.cssText;
  }

  // Método propio: RickMortyApp lo va a llamar para "entregarle" el personaje
  async setCharacter(character, isFavorite = false) { //le agregué favorite *
    this.character = character; // Guarda el personaje recibido
    this.isFavorite = isFavorite; //nueva con fav *
    await this.render(); // Actualiza la tarjeta con la nueva información // / ahora render es async porque espera el fetch del CSS
    this.setupEventListeners(); // hay que re-enganchar el listener cada render *
  }

  async render() {   // ahora render es async porque espera el fetch del CSS
    if (!this.character) return; // si no hay datos aún, no pintames nada (no rederiza nada ps)

     const { name, image, status, species, origin, location, episode } = this.character;// desestructuración de objetos: Extrae los datos necesarios del personaje
     const css = await this.loadStyles(); // espera a que el CSS esté listo

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
//nuevo para el botón de favs jejej 
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
} //le agregué optional chaning para q no se rompa xd, asi como Nullish Coalescing ??:  si origin?.name termina siendo undefined o null, usa 'Desconocido' en su lugar"

customElements.define('character-card', CharacterCard); // Registra el componente personalizado