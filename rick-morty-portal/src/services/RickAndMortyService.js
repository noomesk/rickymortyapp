/**
 * Servicio encargado de comunicarse con la API pública de Rick & Morty.
 * Provee métodos estáticos para obtener personajes según distintos filtros.
 *
 * @class RickAndMortyService
 */
export class RickAndMortyService {
  /**
   * URL base del endpoint de personajes de la API de Rick & Morty.
   * Es un campo privado estático, por lo que solo es accesible dentro de esta clase.
   *
   * @type {string}
   * @private
   * @static
   */
  static #BASE_URL = 'https://rickandmortyapi.com/api/character';

  /**
   * Obtiene una lista de personajes desde la API, permitiendo filtrar
   * opcionalmente por nombre y/o estado (vivo, muerto, desconocido).
   * Si no se especifican filtros, retorna la lista general de personajes.
   *
   * @async
   * @static
   * @param {string} [name=''] - Nombre (o parte del nombre) del personaje a buscar.
   * @param {string} [status=''] - Estado del personaje a filtrar ('alive', 'dead' o 'unknown').
   * @returns {Promise<Object>} Objeto con la respuesta de la API, que incluye
   * información de paginación (`info`) y el array de resultados (`results`).
   * @throws {Error} Si la respuesta de la API no es exitosa (response.ok === false)
   * o si ocurre un error de red durante el fetch.
   */
  static async getCharacters(name = '', status = '') {
    const params = new URLSearchParams();

    if (name) params.append('name', name);
    if (status) params.append('status', status);

    const url = `${RickAndMortyService.#BASE_URL}?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No fue posible obtener el personaje");
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Ocurrió un error:", error);
      throw error;
    }
  }
}