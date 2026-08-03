class SearchFilters extends HTMLElement {
  constructor() {
    super(); // obligatorio: le dice a HTMLElement que se inicialice primero
    this.attachShadow({ mode: 'open' }); // crea la cápsula de cristal
  }

  connectedCallback() {
    // Este método se ejecuta automáticamente cuando el elemento
    // ya está insertado en el documento (cuando el navegador lo "monta")
    this.render();
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
}

customElements.define('search-filters', SearchFilters);

// en el caso de unknown line29: está con casing: lowercase (todo en minusculas, x eso recibe un 
//value=unknown en minúsculas, pero se muestra al user como: Unknown) ajaj q cool
/* TIPOS DE CASING de las API:
"alive"     // lowercase (todo en minúsculas)

"ALIVE"     // UPPERCASE (todo en mayúsculas)

"Alive"     // Capitalized o Pascal word (primera letra mayúscula)

"aLive"     // casing mezclado */ 