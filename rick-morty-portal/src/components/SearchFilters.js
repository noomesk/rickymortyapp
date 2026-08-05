//este si usa ShadowDOM
class SearchFilters extends HTMLElement {
  constructor() {
    super(); // obligatorio: le dice a HTMLElement que se inicialice primero
    this.attachShadow({ mode: 'open' }); // crea la cápsula de cristal
    this.cssText = ''; // nuevo para los estilos y colores del buscador con css 
  }

  connectedCallback() {
    // Este método se ejecuta automáticamente cuando el elemento
    // ya está insertado en el documento (cuando el navegador lo "monta")
    this.render();
    // ya no llamamos setupEventListeners() aquí directamente, porque
    // ahora se llama DESPUÉS de que el HTML exista, dentro de render()
    // (ver comentario más abajo en render())
  }

  // Nuevo: trae el archivo .css como texto plano usando fetch,
  // mismo patrón ya usado en CharacterCard y en el service
  async loadStyles() {
    if (this.cssText) return this.cssText; // evita pedirlo de nuevo si ya lo tenemos
    const response = await fetch('/src/styles/SearchFilters.css');
    this.cssText = await response.text();
    return this.cssText;
  }

  async render() { // ahora render es async porque espera el fetch del CSS
    const css = await this.loadStyles(); // espera a que el CSS esté listo

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

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

    // se llama aquí, DESPUÉS de que this.shadowRoot.innerHTML ya se llenó,
    // porque antes de esto no existía ni el form ni el input ni el select
    // en el Shadow DOM todavía (si se llamaba antes, querySelector no
    // encontraba nada y hubiera dado error)
    this.setupEventListeners();
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


/* para probar en consola que la comunicación ya sirve (bubbles y composed):

document.querySelector('search-filters').addEventListener('search-submitted', (e) => {
  console.log('Evento recibido:', e.detail);
});

 si si: 
 el evento sale de SearchFilters, atraviesa el Shadow DOM (gracias a composed: true), 
 sube por el árbol del DOM (gracias a bubbles: true), 
 y es capturado con el payload correcto {query: 'rick', status: 'Alive'}. */