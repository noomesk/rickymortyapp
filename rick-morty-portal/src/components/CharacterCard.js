//Tmbn usa ShadowDOM 
class CharacterCard extends HTMLElement {
  constructor() {
    super(); // Inicializa la clase base HTMLElement
    this.attachShadow({ mode: 'open' }); // Crea el Shadow DOM del componente
    this.character = null; // aquí se va a guardar el personaje recibido
  }

  // Método propio: RickMortyApp lo va a llamar para "entregarle" el personaje
  setCharacter(character) {
    this.character = character; // Guarda el personaje recibido
    this.render(); // Actualiza la tarjeta con la nueva información
  }

  render() {
    if (!this.character) return; // si no hay datos aún, no pintames nada (no rederiza nada ps)

    const { name, image, status, species } = this.character; // desestructuración de objetos: Extrae los datos necesarios del personaje


    this.shadowRoot.innerHTML = `
      <style>
        .card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 12px;
          width: 200px;
          text-align: center;
          font-family: sans-serif;
        }
        .card img {
          width: 100%;
          border-radius: 8px;
        }
      </style>

      <div class="card">
        <img src="${image}" alt="${name}" />
        <h3>${name}</h3>
        <p>${status} - ${species}</p>
      </div>
    `;
  }
}

customElements.define('character-card', CharacterCard); // Registra el componente personalizado