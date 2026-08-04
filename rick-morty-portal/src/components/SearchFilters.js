class SearchFilters extends HTMLElement {
  constructor() {
    super(); // obligatorio: le dice a HTMLElement que se inicialice primero
    this.attachShadow({ mode: 'open' }); // crea la cápsula de cristal
  }

  connectedCallback() {
    // Este método se ejecuta automáticamente cuando el elemento
    // ya está insertado en el documento (cuando el navegador lo "monta")
    this.render();
    this.setupEventListeners(); // nueva línea para escuchar el evento: boton buscar: detecta cuando haga clic
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .filters-container {
          display: flex;
          gap: 10px;
          padding: 16px;
        }
      </style>

      <form class="filters-container">
        <input type="text" placeholder="Buscar personaje..." />
        <select>
          <option value="">Todos</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>  
        </select>
        <button type="submit">Buscar</button>
      </form>
    `;

    
  }
setupEventListeners() {
  const form = this.shadowRoot.querySelector('form'); // Obtiene el formulario del Shadow DOM, Referencia al formulario


  form.addEventListener('submit', (event) => { // Escucha el envío del formulario, Maneja el evento submit
    event.preventDefault(); // Evita que la página se recargue!  importaaaanshi**  Cancela el comportamiento por defecto del formulario

    const input = this.shadowRoot.querySelector('input'); // Obtiene el campo de texto,  Referencia al input
    const select = this.shadowRoot.querySelector('select'); // Obtiene el menú desplegable, Referencia al select

    const query = input.value; // Guarda el texto escrito por el usuario, Obtiene el valor del input
    const status = select.value; // Guarda la opción seleccionada, Obtiene el valor del select
    const evento = new CustomEvent('search-submitted',{ //crear el evento 
      detail: { query, status }, //objeto con 3 propiedades, en detail va la info real el "paq de datos q quiero enviar"
      bubbles: true, //esto permite que suba por el arbol del DOM  (jaja como una burbuja xd amo las burbujas)
      composed: true //permite q atraviese la pared del shadowDOM
      });//crear el custom event 
      
    this.dispatchEvent(evento); //disparar el evento  
   });
  }
}

customElements.define('search-filters', SearchFilters); // registra el nombre de la clase, dsps de q ya la defini

// en el caso de unknown line29: está con casing: lowercase (todo en minusculas, x eso recibe un 
//value=unknown en minúsculas, pero se muestra al user como: Unknown) ajaj q cool
/* TIPOS DE CASING de las API:
"alive"     // lowercase (todo en minúsculas)

"ALIVE"     // UPPERCASE (todo en mayúsculas)

"Alive"     // Capitalized o Pascal word (primera letra mayúscula)

"aLive"     // casing mezclado */ 