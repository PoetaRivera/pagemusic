# Seguimiento Fase 1 - PageMusic

## Completado

### 2026-04-08
- **QR Code generado**: Se creó el archivo `qrcode.html` en la raíz del proyecto.
  - Genera un código QR para `https://pagemusic-production.up.railway.app/`
  - Incluye botón para descargar el QR como imagen PNG
  - Estilo oscuro acorde al diseño de PageMusic
  - Usa la librería QRCode.js desde CDN

### 2026-04-09
- **Pruebas unitarias backend**: Se implementaron 34 tests — todos pasando ✓
  - Stack: Jest + Supertest + SQLite `:memory:` en `NODE_ENV=test`
  - Archivos creados:
    - `server/jest.config.js`
    - `server/src/tests/helpers.js` — utilidades: resetDB, seedGenre, seedSong, getAdminToken
    - `server/src/tests/auth.test.js` — 7 tests (login + verify token)
    - `server/src/tests/genres.test.js` — 14 tests (CRUD completo de géneros)
    - `server/src/tests/songs.test.js` — 13 tests (CRUD + search + duration patch)
  - Comando para correr: `cd server && npm test`

### 2026-04-09
- **Pruebas unitarias frontend**: Se implementaron 45 tests — todos pasando ✓
  - Stack: Vitest + @testing-library/react + jsdom
  - Archivos creados:
    - `client/src/tests/setup.js` — importa @testing-library/jest-dom
    - `client/src/tests/Spinner.test.jsx` — 2 tests
    - `client/src/tests/Modal.test.jsx` — 4 tests (open/close, children, onClose)
    - `client/src/tests/GenreCard.test.jsx` — 4 tests (render, link, cover_url)
    - `client/src/tests/SongCard.test.jsx` — 5 tests (render, formatDuration, playSong)
    - `client/src/tests/SongList.test.jsx` — 3 tests (render, vacío)
    - `client/src/tests/playerStore.test.js` — 13 tests (playSong, togglePlay, next/prev, repeat, shuffle)
    - `client/src/tests/playlistStore.test.js` — 11 tests (CRUD playlists, addSong sin duplicados)
  - Comando para correr: `cd client && npm test`

### 2026-04-09 (bug crítico producción)
- **Bug fix: servidor no arrancaba en Railway** — `seed.js` llamaba `process.exit(0)` al ser importado por `index.js`. Si la DB ya tenía datos, el proceso moría antes de escuchar en el puerto.
  - `seed.js`: convertido a función exportable `seedIfEmpty(db)`, sin `process.exit`. Aún funciona standalone con `node src/seed.js`
  - `db.js`: llama `seedIfEmpty(db)` directamente (solo en non-test)
  - `index.js`: eliminado el `import './seed.js'`
  - Tests: 34/34 siguen pasando

### 2026-04-12
- **Funcionalidad: Navegación por artista** — implementación completa
  - Backend:
    - `GET /api/artists` — lista todos los artistas con cantidad de canciones y géneros
    - `GET /api/artists/:name/songs` — canciones de un artista específico
    - Búsqueda extendida: ahora busca también por nombre de artista
  - Frontend:
    - `ArtistCard.jsx` — tarjeta de artista con gradiente y contador de canciones
    - `ArtistsPage.jsx` — página de listado de artistas (`/artists`)
    - `ArtistPage.jsx` — página individual del artista con Reproducir y Aleatorio (`/artist/:name`)
    - `Sidebar.jsx` — nuevo ítem "Artistas" en la navegación
    - `App.jsx` — nuevas rutas `/artists` y `/artist/:name`
    - `api/artists.js` — funciones de API para artistas
  - Tests backend: 34/34 siguen pasando

### 2026-04-15
- **Funcionalidad: Reproducir canciones desde panel admin** — implementación completa
  - Archivo modificado: `client/src/components/admin/SongTable.jsx`
  - Se agregó botón Play/Pause en cada fila de la tabla de canciones del admin
  - Al hacer clic en la portada (hover muestra el ícono) o en el botón de la columna de acciones, se reproduce la canción usando el `playerStore` existente
  - La canción activa se resalta en morado (título en púrpura, fila con fondo sutil)
  - Si se pulsa la canción que ya está reproduciendo, alterna play/pause
  - La cola de reproducción se establece con todas las canciones de la tabla

### 2026-04-15 (bug fix)
- **Bug fix: genre_id como número no emparejaba el `<select>`**
  - `SongForm.jsx` línea 24: `initial.genre_id` llega como número desde la DB pero el `<select>` compara strings → el género no se preseleccionaba correctamente al editar
  - Fix: `String(initial.genre_id)` al inicializar el form
- **Mejora: toast de confirmación en panel admin**
  - `AdminDashboardPage.jsx`: se agregó estado `toast` y función `showToast`
  - Se muestra mensaje verde flotante por 3 segundos al crear, editar o eliminar canciones y géneros
  - Elimina la ambigüedad de si el cambio fue guardado o no

### 2026-04-16
- **Mejora: conteo de canciones en tabla de géneros (admin)**
  - `server/src/controllers/genres.controller.js`: `getAll` ahora hace LEFT JOIN con `songs` y retorna `song_count` por género
  - `client/src/components/admin/GenreTable.jsx`: nueva columna "Canciones" visible desde pantallas `md` en adelante, muestra el conteo

- **Limpieza y resubida completa de audios (226 MP3)**
  - Repo `PoetaRivera/pagemusic-storage`: todos los archivos viejos eliminados y reemplazados con los 226 archivos locales desde `MUSICA-POEMAS/audios/mp3/`, organizados por género
  - Géneros nuevos añadidos: `soul` (8) y `bossanova` (2)
  - `server/src/seed.js`: reescrito con los 226 canciones y 12 géneros correctos
  - `server/src/reset-and-seed.js`: script nuevo para limpiar la DB de producción y re-sembrar
  - **Pendiente ejecutar en Railway**: `cd server && railway run node src/reset-and-seed.js`

## Pendiente / Por donde continuar

- Cobertura de código (coverage report): `vitest run --coverage`
- Agregar tests de páginas (HomePage, GenrePage, AdminLoginPage)
- Abrir `qrcode.html` en el navegador para visualizar y descargar el QR
