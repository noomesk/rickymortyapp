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

     const { name, image, status, species, origin, location, episode } = this.character;// desestructuración de objetos: Extrae los datos necesarios del personaje


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
        <p><strong>Origen:</strong> ${origin?.name ?? 'Desconocido'}</p> 
        <p><strong>Ubicación:</strong> ${location?.name ?? 'Desconocida'}</p>
        <p><strong>Episodios:</strong> ${episode?.length ?? 0}</p>
      </div>
    `;
  }
} //le agregué optional chaning para q no se rompa xd, asi como Nullish Coalescing ??:  si origin?.name termina siendo undefined o null, usa 'Desconocido' en su lugar"

customElements.define('character-card', CharacterCard); // Registra el componente personalizado