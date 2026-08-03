# SPRINT 0 — Rick & Morty Portal Finder
### Documento técnico de planificación (Diseño de arquitectura frontend)

**Autor:** Angie (Frontend Trainee)  
**Rol de acompañamiento:** Tech Lead Senior Frontend  
**Stack:** JavaScript Vanilla (ES6+) + Web Components (Custom Elements + Shadow DOM)  
**Duración del proyecto:** 5 días laborales

---

## 1. Objetivo general

Construir una aplicación web (**Rick & Morty Portal Finder**) que permita a un usuario:

- Buscar personajes de la serie por nombre.
- Filtrar dichos personajes por estado vital (`alive`, `dead`, `unknown`).
- Marcar/desmarcar personajes como favoritos, con persistencia entre recargas de página.
- Visualizar información estructurada de cada personaje (imagen, especie, estado, origen, ubicación, episodios).

El objetivo pedagógico real (el que se evalúa) **no es la app en sí**, sino demostrar dominio de:

1. Arquitectura basada en componentes desacoplados (Web Components nativos).
2. Encapsulación real mediante Shadow DOM.
3. Comunicación unidireccional mediante Custom Events.
4. Manejo correcto de estados asíncronos (loading / success / error).
5. Persistencia de datos en el cliente (`localStorage`).
6. Buenas prácticas de ingeniería: SRP, separación de responsabilidades, manejo seguro de datos externos.

> **Por qué esto importa:** en la defensa técnica no te van a preguntar "¿funciona el buscador?". Te van a preguntar "¿por qué SearchFilters no accede directamente a FavoritesList?". Este documento existe para que tengas esa respuesta lista *antes* de que la pregunten.

---

## 2. Alcance (Scope)

### ✅ Incluido en el MVP

- Búsqueda de personajes por nombre (consumo de API real).
- Filtro por estado (`alive`, `dead`, `unknown`) combinado con la búsqueda.
- Renderizado dinámico de tarjetas de personaje.
- Marcar/desmarcar como favorito desde la tarjeta.
- Lista de favoritos persistente en `localStorage`.
- Eliminar favoritos desde la lista de favoritos (con delegación de eventos).
- Manejo visual de 3 estados: cargando, éxito, error.
- Validación básica del input de búsqueda.
- Semáforo visual de estado (Alive/Dead/Unknown) en el filtro.

### ❌ Explícitamente fuera del MVP (para evitar sobreingeniería)

- Paginación de resultados (la API la soporta, pero **no** la pide la rúbrica; agregarla añade complejidad sin sumar puntos).
- Vista de detalle en página separada / routing (no hay SPA router en el enunciado).
- Tests automatizados (unitarios/e2e) — el propio enunciado pide checklist manual.
- Autenticación de usuarios.
- Uso de frameworks (Lit, React, Vue) — el enunciado exige Vanilla JS explícitamente.
- Bundlers (Webpack/Vite) — usamos `<script type="module">` nativo, tal como está en el HTML base.
- Internacionalización (i18n).
- Modo oscuro / temas.

> **Justificación de "no sobreingeniería":** cada funcionalidad que agregamos fuera del scope consume tiempo de los 5 días y **no suma puntos en la rúbrica**. Peor: si agregas algo como un router casero y no lo entiendes al 100%, un senior lo va a detectar en 30 segundos y va a bajar tu nota en "Buenas Prácticas". Es mejor un MVP sólido y 100% explicable que una app "impresionante" con zonas grises.

---

## 3. Requerimientos

### 3.1 Requerimientos funcionales

| ID | Requerimiento | Relación con rúbrica |
|----|----------------|----------------------|
| RF-01 | El usuario puede escribir un nombre y buscar personajes | Comunicación e Interacción (20%) |
| RF-02 | El usuario puede filtrar por estado (alive/dead/unknown) | Comunicación e Interacción (20%) |
| RF-03 | El sistema valida que la búsqueda no esté vacía ni tenga caracteres especiales | Robustez y Manejo de Datos (20%) |
| RF-04 | El usuario puede marcar un personaje como favorito | Comunicación e Interacción (20%) |
| RF-05 | El usuario puede eliminar un personaje de favoritos | Robustez y Manejo de Datos (20%) |
| RF-06 | Los favoritos persisten tras recargar la página | Robustez y Manejo de Datos (20%) |
| RF-07 | El sistema muestra tarjetas con imagen, nombre, especie, estado, origen, ubicación y cantidad de episodios | Arquitectura y Modularidad (25%) |
| RF-08 | El sistema muestra estado de carga mientras espera la respuesta de la API | Robustez y Manejo de Datos (20%) |
| RF-09 | El sistema muestra un mensaje de error si la API falla o no hay resultados | Robustez y Manejo de Datos (20%) |

### 3.2 Requerimientos no funcionales

| ID | Requerimiento | Relación con rúbrica |
|----|----------------|----------------------|
| RNF-01 | Los estilos de cada componente deben estar aislados (no deben filtrarse al DOM global) | Encapsulación y Shadow DOM (20%) |
| RNF-02 | El código debe ser legible: nombres descriptivos, funciones pequeñas | Buenas Prácticas (15%) |
| RNF-03 | La aplicación debe responder de forma fluida (uso de `DocumentFragment` para evitar reflow excesivo) | Buenas Prácticas (15%) |
| RNF-04 | La aplicación debe degradar con gracia ante datos incompletos de la API (Optional Chaining) | Robustez y Manejo de Datos (20%) |

### 3.3 Requerimientos técnicos

| ID | Requerimiento | Relación con rúbrica |
|----|----------------|----------------------|
| RT-01 | Toda la UI debe construirse con Custom Elements (`customElements.define`) | Arquitectura y Modularidad (25%) |
| RT-02 | `CharacterCard` y `SearchFilters` deben usar Shadow DOM | Encapsulación y Shadow DOM (20%) |
| RT-03 | La comunicación entre componentes debe ser exclusivamente vía Custom Events con `bubbles: true, composed: true` | Comunicación e Interacción (20%) |
| RT-04 | El servicio de datos debe ser una clase ES6 con método estático y URL base encapsulada (propiedad privada) | Arquitectura y Modularidad (25%) |
| RT-05 | Toda petición a la API debe usar `fetch` + `async/await` + `try/catch` | Robustez y Manejo de Datos (20%) |
| RT-06 | Favoritos deben serializarse/deserializarse con `JSON.stringify`/`JSON.parse` | Robustez y Manejo de Datos (20%) |

### 3.4 Requerimientos arquitectónicos

| ID | Requerimiento | Relación con rúbrica |
|----|----------------|----------------------|
| RA-01 | Cada componente tiene una única responsabilidad (SRP) | Arquitectura y Modularidad (25%) |
| RA-02 | `RickMortyApp` es el único componente que conoce el estado global de la aplicación | Arquitectura y Modularidad (25%) |
| RA-03 | Ningún componente hijo debe manipular directamente a otro componente hermano | Comunicación e Interacción (20%) |
| RA-04 | El renderizado de listas debe usar `.map()`, `.filter()` y `DocumentFragment` | Buenas Prácticas (15%) |

**Pregunta de control (respóndeme antes de seguir):**
¿Por qué crees que separé los requerimientos en 4 categorías distintas (funcional, no funcional, técnico, arquitectónico) en lugar de poner todo en una sola lista?

---

## 4. Historias de usuario

> **HU-01**
> Como usuario
> Quiero buscar personajes por nombre
> Para encontrar rápidamente personajes específicos de Rick and Morty.

> **HU-02**
> Como usuario
> Quiero filtrar personajes por su estado (vivo, muerto, desconocido)
> Para reducir los resultados a lo que realmente me interesa.

> **HU-03**
> Como usuario
> Quiero recibir una alerta visual si mi búsqueda es inválida (vacía o con caracteres especiales)
> Para saber que debo corregir mi entrada antes de continuar.

> **HU-04**
> Como usuario
> Quiero marcar un personaje como favorito desde su tarjeta
> Para poder encontrarlo fácilmente después sin tener que buscarlo de nuevo.

> **HU-05**
> Como usuario
> Quiero que mis favoritos se mantengan guardados aunque cierre o recargue el navegador
> Para no perder mi selección previa.

> **HU-06**
> Como usuario
> Quiero eliminar un personaje de mi lista de favoritos
> Para mantener mi lista organizada y relevante.

> **HU-07**
> Como usuario
> Quiero ver un indicador de carga mientras se buscan los personajes
> Para saber que el sistema está procesando mi solicitud y no está congelado.

> **HU-08**
> Como usuario
> Quiero ver un mensaje claro si ocurre un error o no hay resultados
> Para entender qué pasó y qué puedo hacer al respecto.

> **HU-09**
> Como usuario
> Quiero ver la información relevante de cada personaje (imagen, especie, estado, origen, ubicación, episodios)
> Para conocer detalles sin tener que salir de la aplicación.

---

## 5. Casos de uso

### CU-01: Buscar personajes por nombre y estado

**Actor:** Usuario
**Precondición:** La aplicación está cargada.
**Flujo principal:**
1. El usuario escribe un nombre en el input de búsqueda.
2. Opcionalmente selecciona un estado en el `<select>`.
3. El usuario envía el formulario (submit).
4. `SearchFilters` valida la entrada.
5. Si es válida, dispara `search-submitted` con `{ query, status }`.
6. `RickMortyApp` escucha el evento, cambia su estado interno a `loading`.
7. `RickMortyApp` llama a `RickAndMortyService.getCharacters(query, status)`.
8. Si la promesa resuelve con datos: estado pasa a `success`, se renderizan las tarjetas.
9. Si la promesa fue rechazada o no hay resultados: estado pasa a `error`.

**Flujo alternativo (validación fallida):**
4a. Si el input está vacío o tiene caracteres inválidos, `SearchFilters` muestra una alerta visual y **no dispara el evento**. El flujo se detiene ahí.

---

### CU-02: Marcar personaje como favorito

**Actor:** Usuario
**Precondición:** Existe al menos un personaje renderizado en pantalla.
**Flujo principal:**
1. El usuario hace clic en el ícono/botón de favorito dentro de `CharacterCard`.
2. `CharacterCard` dispara `toggle-favorite` con `{ characterId, characterData }`.
3. `RickMortyApp` escucha el evento.
4. `RickMortyApp` actualiza el arreglo de favoritos en memoria (usando `.filter()` si ya existía, o agregándolo si no).
5. `RickMortyApp` persiste el nuevo arreglo en `localStorage` (`JSON.stringify`).
6. `RickMortyApp` actualiza el estado visual (`favorites`) que se pasa a `FavoritesList`.

---

### CU-03: Eliminar un favorito desde la lista de favoritos

**Actor:** Usuario
**Precondición:** Existe al menos un favorito guardado.
**Flujo principal:**
1. El usuario hace clic en "eliminar" sobre un ítem dentro de `FavoritesList`.
2. Gracias a la **delegación de eventos**, un único listener en el contenedor padre de la lista captura el clic.
3. `FavoritesList` identifica qué ítem se eliminó (por `data-id` o similar).
4. `FavoritesList` dispara `favorites-updated` con el nuevo arreglo de favoritos.
5. `RickMortyApp` escucha el evento, actualiza su estado y persiste en `localStorage`.

---

### CU-04: Recuperar favoritos al recargar la página

**Actor:** Sistema (automático)
**Precondición:** El usuario había guardado favoritos previamente.
**Flujo principal:**
1. Al montarse `RickMortyApp` (`connectedCallback`), se lee `localStorage`.
2. Se deserializa con `JSON.parse`.
3. Si existen datos válidos, se cargan al estado `favorites`.
4. Se renderiza `FavoritesList` con esos datos.

**Flujo alternativo:** Si `localStorage` está vacío o corrupto, se inicializa `favorites` como arreglo vacío (`[]`), sin lanzar error.

---

**Pregunta de control:**
En el CU-02, ¿por qué crees que es `RickMortyApp` quien decide si el personaje se agrega o se quita del arreglo de favoritos, y no `CharacterCard`?

---

## 6. Arquitectura

### 6.1 Organización de carpetas
