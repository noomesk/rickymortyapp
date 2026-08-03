export class RickAndMortyService {
  // El símbolo # convierte esta propiedad en PRIVADA a nivel de motor
  // de JavaScript. Nadie fuera de esta clase puede leerla ni modificarla.
  // Es un campo estático porque pertenece a la CLASE, no a una instancia
  // (no vamos a hacer "new RickAndMortyService()" nunca).
  static #BASE_URL = 'https://rickandmortyapi.com/api/character';

  static async getCharacters(name = '', status = '') {
    // URLSearchParams construye el string de query params (?name=...&status=...)
    // de forma segura, sin que tengamos que concatenar strings a mano
    // (evita errores con caracteres especiales que rompen la URL).
    const params = new URLSearchParams(); // API nativa del navegador  construye el query string correctamente formateado y codificado
    
    if (name) params.append('name', name); // Si "name" NO está vacío (string vacío es "falsy" en JS), agrega el par name=loQueSeaQueEscribióElUsuario
    if (status) params.append('status', status); // iwal q name

    const url = `${RickAndMortyService.#BASE_URL}?${params.toString()}`;

    // AQUÍ es tu turno: fetch + try/catch + await

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No fue posible obtener el personajeS");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ocurrió un error:", error);
    throw error;
  }
}
  
}