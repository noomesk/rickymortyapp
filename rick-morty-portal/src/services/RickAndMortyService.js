export class RickAndMortyService {
  static #BASE_URL = 'https://rickandmortyapi.com/api/character';

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