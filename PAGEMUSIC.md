# PageMusic — Documentación Técnica del Proyecto

> Generada desde el código fuente real. Fecha: 2026-04-16.

---

## Índice

1. [Descripción general](#descripción-general)
2. [Estructura de carpetas](#estructura-de-carpetas)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Base de datos](#base-de-datos)
6. [Autenticación y seguridad](#autenticación-y-seguridad)
7. [Almacenamiento de audio](#almacenamiento-de-audio)
8. [Despliegue (Railway)](#despliegue-railway)
9. [Scripts de utilidad](#scripts-de-utilidad)
10. [Tests](#tests)
11. [Reglas para futuras sesiones de modificación](#reglas-para-futuras-sesiones-de-modificación)

---

## Descripción general

Aplicación web de streaming de música. El administrador sube canciones organizadas por géneros; los usuarios las escuchan con un reproductor global persistente. No hay registro de usuarios — el consumo es completamente público.

- **URL producción:** `https://pagemusic-production.up.railway.app`
- **Plataforma:** Railway (servidor único que sirve API + frontend compilado)
- **Artista principal:** PoetaRivera

---

## Estructura de carpetas

```
PAGEMUSIC/
├── server/                     # Backend Node.js/Express
│   ├── src/
│   │   ├── app.js              # Express app (rutas, middlewares, static)
│   │   ├── index.js            # Entry point (listen)
│   │   ├── config.js           # Variables de entorno exportadas
│   │   ├── db.js               # Inicialización SQLite + tablas + índices + seed admin
│   │   ├── seed.js             # seedIfEmpty(db) — 226 canciones, 12 géneros
│   │   ├── reset-and-seed.js   # Script de reseteo (requiere --force)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── genres.controller.js
│   │   │   ├── songs.controller.js
│   │   │   ├── stats.controller.js
│   │   │   └── artists.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── genres.routes.js
│   │   │   ├── songs.routes.js
│   │   │   ├── upload.routes.js
│   │   │   ├── stats.routes.js
│   │   │   └── artists.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # requireAdmin (JWT)
│   │   │   └── validator.middleware.js  # validate(schema) con Zod
│   │   ├── schemas/
│   │   │   ├── auth.schema.js
│   │   │   ├── genre.schema.js
│   │   │   └── song.schema.js
│   │   └── tests/
│   │       ├── helpers.js
│   │       ├── auth.test.js
│   │       ├── genres.test.js
│   │       └── songs.test.js
│   ├── database/
│   │   └── pagemusic.db        # SQLite (ignorado por git)
│   ├── uploads/                # Covers subidos desde admin (ignorado por git)
│   ├── package.json
│   └── jest.config.js
│
├── client/                     # Frontend React/Vite
│   ├── src/
│   │   ├── App.jsx             # Router, rutas, layout principal
│   │   ├── main.jsx
│   │   ├── index.css           # Variables CSS globales (colores, temas)
│   │   ├── api/
│   │   │   ├── axios.js        # Instancia axios con interceptores JWT + 401
│   │   │   ├── auth.js
│   │   │   ├── genres.js
│   │   │   ├── songs.js
│   │   │   ├── artists.js
│   │   │   ├── stats.js
│   │   │   └── admin.js
│   │   ├── store/
│   │   │   ├── adminStore.js   # JWT + expiración en rehydrate (Zustand persist)
│   │   │   ├── playerStore.js  # Cola, shuffle, repeat, volumen (persist parcial)
│   │   │   └── playlistStore.js # Playlists locales (Zustand persist localStorage)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── GenrePage.jsx
│   │   │   ├── ArtistsPage.jsx
│   │   │   ├── ArtistPage.jsx
│   │   │   ├── PlaylistsPage.jsx
│   │   │   ├── PlaylistDetailPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── player/
│   │   │   │   └── GlobalPlayer.jsx
│   │   │   ├── catalog/
│   │   │   │   ├── GenreCard.jsx
│   │   │   │   ├── SongCard.jsx
│   │   │   │   ├── SongList.jsx
│   │   │   │   └── ArtistCard.jsx
│   │   │   ├── admin/
│   │   │   │   ├── GenreTable.jsx
│   │   │   │   ├── GenreForm.jsx
│   │   │   │   ├── SongTable.jsx
│   │   │   │   └── SongForm.jsx
│   │   │   └── ui/
│   │   │       ├── Spinner.jsx
│   │   │       └── Modal.jsx
│   │   └── tests/              # Vitest + Testing Library
│   └── package.json
│
├── add-songs.js                # Script CLI para agregar canciones (copia + LFS push + API)
├── add-songs-instrucciones.txt # Guía de uso del script
├── qrcode.html                 # Genera QR de la URL de producción
├── .env                        # Credenciales locales (gitignore)
├── .env.example                # Plantilla pública del .env
├── .gitignore
└── siguimiento-fase1.md        # Log de progreso del proyecto
```

---

## Backend

### Stack

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | ^4.18 | Framework HTTP |
| better-sqlite3 | ^9.4 | SQLite síncrono |
| jsonwebtoken | ^9.0 | JWT (8h expiry) |
| bcryptjs | ^2.4 | Hash de contraseña |
| zod | ^3.21 | Validación de schemas |
| multer | ^2.1 | Upload de archivos MP3/covers |
| express-rate-limit | ^8.3 | Rate limiting en login |
| morgan | ^1.10 | Logging HTTP |
| cors | ^2.8 | CORS restringido a FRONTEND_URL |

### Comandos

```bash
cd server
npm run dev     # nodemon + NODE_ENV=development
npm start       # NODE_ENV=production (usado por Railway)
npm test        # Jest + Supertest + SQLite :memory:
```

### Variables de entorno del servidor

| Variable | Default | Requerida en prod |
|----------|---------|-------------------|
| `PORT` | 4000 | No |
| `FRONTEND_URL` | http://localhost:5173 | No |
| `JWT_SECRET` | fallback_secret_inseguro | **Sí, mín 32 chars** |
| `ADMIN_USERNAME` | admin | No |
| `ADMIN_PASSWORD` | admin1234 | **Sí, valor distinto** |
| `NODE_ENV` | — | Sí (`production`) |

Si `NODE_ENV=production` y `JWT_SECRET` o `ADMIN_PASSWORD` no cumplen los requisitos, el servidor **lanza una excepción al arrancar** (fallo rápido).

### API — Todas las rutas

#### Autenticación (`/api/admin`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/admin/login` | No | Login (rate limit: 10/15min por IP) |
| GET | `/api/admin/verify` | Sí | Verifica token activo |

**Login body:** `{ username, password }`
**Login response:** `{ token, username }`
Token: JWT firmado con `JWT_SECRET`, expira en **8 horas**.

#### Géneros (`/api/genres`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/genres` | No | Lista todos — incluye `song_count` (LEFT JOIN) |
| GET | `/api/genres/:id` | No | Obtiene un género |
| GET | `/api/genres/:id/songs` | No | Canciones de un género |
| POST | `/api/genres` | Sí | Crea género |
| PUT | `/api/genres/:id` | Sí | Edita género |
| DELETE | `/api/genres/:id` | Sí | Elimina género (falla si tiene canciones — FK RESTRICT) |

#### Canciones (`/api/songs`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/songs` | No | Lista todas las canciones |
| GET | `/api/songs/search?q=` | No | Búsqueda por título, artista o nombre de artista (máx 100 chars) |
| POST | `/api/songs` | Sí | Crea canción |
| PUT | `/api/songs/:id` | Sí | Edita canción |
| PATCH | `/api/songs/:id/duration` | No | Actualiza duración real (desde el player) |
| DELETE | `/api/songs/:id` | Sí | Elimina canción |

#### Upload (`/api/admin/upload`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/admin/upload?genre=<género>` | Sí | Sube MP3 al servidor local (`/uploads/<género>/`) |

- Límite: 50 MB por archivo
- Solo acepta `audio/mpeg` o `.mp3`
- El `genre` del query se sanitiza contra whitelist de 12 géneros válidos (prevención de path traversal)
- Retorna `{ url, filename, genre }`

#### Estadísticas (`/api/stats`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/stats/plays` | No | Registra reproducción |
| GET | `/api/stats/summary` | Sí | Resumen (total plays, canciones, géneros) |
| GET | `/api/stats/top-songs` | Sí | Top canciones más reproducidas |
| GET | `/api/stats/top-genres` | Sí | Top géneros |
| GET | `/api/stats/by-hour` | Sí | Plays agrupados por hora |
| GET | `/api/stats/by-weekday` | Sí | Plays agrupados por día de semana |
| GET | `/api/stats/most-skipped` | Sí | Canciones más saltadas |

#### Artistas (`/api/artists`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/artists` | No | Lista artistas con cantidad de canciones y géneros |
| GET | `/api/artists/:name/songs` | No | Canciones de un artista específico |

---

## Frontend

### Stack

| Paquete | Versión | Uso |
|---------|---------|-----|
| React | ^19 | UI |
| Vite | ^8 | Build tool |
| Tailwind CSS | ^4 | Estilos utilitarios |
| React Router DOM | ^7 | Routing |
| Zustand | ^5 | Estado global |
| Axios | ^1.14 | HTTP client |
| react-icons | ^5.6 | Iconos |

### Comandos

```bash
cd client
npm run dev     # Vite dev server (puerto 5173)
npm run build   # Compila a client/dist/
npm test        # Vitest run (CI)
npm run test:watch  # Vitest interactivo
```

### Rutas de la aplicación

| Ruta | Componente | Pública |
|------|-----------|---------|
| `/` | HomePage | Sí |
| `/genre/:id` | GenrePage | Sí |
| `/artists` | ArtistsPage | Sí |
| `/artist/:name` | ArtistPage | Sí |
| `/playlists` | PlaylistsPage | Sí |
| `/playlist/:id` | PlaylistDetailPage | Sí |
| `/admin` | AdminLoginPage | Sí |
| `/admin/dashboard` | AdminDashboardPage | **Solo admin** |
| `*` | → `/` | — |

La ruta `/admin/dashboard` está protegida por `AdminProtectedRoute` — si `isAdmin` es `false` redirige a `/admin`.

### Stores (Zustand)

#### `adminStore` (`admin-storage` en localStorage)

```
token: string | null
username: string | null
isAdmin: boolean
login(token, username)
logout()
```

- Al rehydratar: si el token JWT está expirado → `logout()` automático
- En 401 HTTP → axios interceptor llama `logout()` + redirige a `/admin`

#### `playerStore` (`pagemusic-player-prefs` en localStorage)

```
currentSong, queue, originalQueue, isPlaying
isShuffle, isRepeat ('none'|'one'|'all'), volume
currentTime, duration, showQueue

playSong(song, queue?)    — inicia reproducción, establece cola
playNext()                — respeta isRepeat
playPrev()                — si currentTime > 3s, reinicia; si no, va al anterior
toggleShuffle()           — mezcla/restaura cola
toggleRepeat()            — cicla: none → all → one → none
togglePlay(), setVolume(), setCurrentTime(), setDuration()
toggleQueue(), playFromQueue(song)
```

**Solo se persiste en localStorage:** `volume`, `isShuffle`, `isRepeat`. El estado de reproducción es efímero.

#### `playlistStore` (`pagemusic-playlists` en localStorage)

```
playlists: [{ id, name, songs[] }]

createPlaylist(name) → id
deletePlaylist(id)
renamePlaylist(id, name)
addSong(playlistId, song)     — previene duplicados
removeSong(playlistId, songId)
getPlaylist(id)
```

Las playlists son **locales del navegador**. No se guardan en el servidor.

---

## Base de datos

SQLite gestionado con `better-sqlite3` (síncrono). Archivo: `server/database/pagemusic.db`.

En tests: `:memory:` (se recrea en cada suite).

### Esquema

```sql
CREATE TABLE genres (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url   TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  artist     TEXT NOT NULL,
  album      TEXT,
  duration   INTEGER,              -- segundos, nullable (se actualiza en runtime)
  audio_url  TEXT NOT NULL,        -- URL pública al MP3
  cover_url  TEXT,
  genre_id   INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
);

CREATE TABLE admin (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL      -- bcryptjs, 10 rounds
);

CREATE TABLE plays (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id           INTEGER NOT NULL,
  played_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
  duration_listened REAL,
  completed         INTEGER DEFAULT 0,
  skipped           INTEGER DEFAULT 0,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_plays_song_id  ON plays(song_id);
CREATE INDEX IF NOT EXISTS idx_plays_played_at ON plays(played_at);
```

**Notas:**
- `genres.id` → `songs.genre_id`: ON DELETE RESTRICT (no se puede borrar un género con canciones)
- `songs.id` → `plays.song_id`: ON DELETE CASCADE (al borrar una canción se eliminan sus plays)
- `duration` en songs es nullable; se actualiza via `PATCH /api/songs/:id/duration` cuando el navegador carga el audio

---

## Autenticación y seguridad

- **JWT:** firmados con `JWT_SECRET`, expiran en 8h. El middleware `requireAdmin` verifica en cada request protegida.
- **Bcrypt:** contraseña admin hasheada con 10 rondas al crear la cuenta en `db.js`.
- **Rate limiting:** 10 intentos de login por IP en ventana de 15 minutos.
- **Validación de entrada:** Zod schemas en todas las rutas de escritura. Búsqueda limitada a 100 caracteres.
- **Path traversal:** genre en upload se valida contra whitelist exacta de 12 géneros.
- **Token expirado en cliente:** al recargar app, si el JWT en localStorage está expirado, el store hace logout automático.
- **401 automático:** cualquier response 401 del servidor → logout + redirect a `/admin`.
- **Fallo rápido en prod:** si `JWT_SECRET` < 32 chars o `ADMIN_PASSWORD` = 'admin1234', el servidor no arranca.

---

## Almacenamiento de audio

Los MP3 se almacenan en GitHub con Git LFS:
- **Repositorio:** `PoetaRivera/pagemusic-storage`
- **URL base de archivos:** `https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/{genre}/{filename}`

Los `audio_url` de las canciones en la DB apuntan a esas URLs públicas de GitHub.

### Géneros válidos (12)

```
bachata  balada  bolero  bossanova  declamado
otros    pop     rock    salsa      soul    tango    trova
```

Esta lista es la **fuente de verdad**. Coincide con:
- La whitelist en `upload.routes.js`
- Las carpetas en el repo `pagemusic-storage`
- Los géneros en `seed.js`
- La guía `add-songs-instrucciones.txt`

---

## Despliegue (Railway)

- El servidor sirve la API en `/api/*` y el frontend compilado como archivos estáticos desde `client/dist/`.
- En producción, cualquier ruta no-API cae al `index.html` de React (SPA fallback).
- Variables de entorno configuradas en Railway (no en archivos).

### Variables necesarias en Railway

```
NODE_ENV=production
PORT=                   # Railway lo inyecta automáticamente
JWT_SECRET=             # Mín 32 caracteres, aleatorio
ADMIN_USERNAME=admin
ADMIN_PASSWORD=         # Valor seguro distinto de 'admin1234'
FRONTEND_URL=https://pagemusic-production.up.railway.app
```

### Reset de producción (cuando se necesite re-sembrar)

```bash
railway login           # abre browser OAuth — requiere interacción
cd server
railway run node src/reset-and-seed.js --force
```

---

## Scripts de utilidad

### `add-songs.js` (raíz del proyecto)

Agrega canciones nuevas a producción sin usar el panel admin.

**Flujo:**
1. Copia el MP3 desde `MUSICA-POEMAS/audios/mp3/<género>/` a `pagemusic-storage-temp/<género>/`
2. `git add` + `git commit` + `git push` con LFS al repo `pagemusic-storage`
3. POST a `/api/songs` en producción con título (nombre del archivo sin `.mp3`) y artista `PoetaRivera`

**Uso:**
```bash
node add-songs.js <género> [archivo.mp3]   # un archivo específico
node add-songs.js <género>                  # todos los mp3 del género
```

**Requiere:**
- `.env` en la raíz con `SCRIPT_ADMIN_USER` y `SCRIPT_ADMIN_PASS`
- Carpeta `pagemusic-storage-temp` clonada en `C:/CARPETA-RESPALDO/Escritorio/misproyectos/`

### `server/src/reset-and-seed.js`

Limpia la DB de producción y re-siembra con los datos de `seed.js`. **Requiere `--force`** para evitar ejecución accidental.

```bash
node src/reset-and-seed.js --force
```

---

## Tests

### Backend — Jest + Supertest

```bash
cd server && npm test
```

- **34 tests** distribuidos en 3 suites: `auth.test.js` (7), `genres.test.js` (14), `songs.test.js` (13)
- DB en memoria (`:memory:`), se recrea con helpers por suite
- Helpers: `resetDB`, `seedGenre`, `seedSong`, `getAdminToken`

### Frontend — Vitest + Testing Library

```bash
cd client && npm test
```

- **45 tests** distribuidos en 7 archivos
- `Spinner`, `Modal`, `GenreCard`, `SongCard`, `SongList`, `playerStore`, `playlistStore`
- jsdom como entorno, setup importa `@testing-library/jest-dom`

---

## Reglas para futuras sesiones de modificación

Estas reglas son obligatorias. Ignorarlas puede romper la aplicación en producción.

### 1. Nunca cambiar los nombres de género sin actualizar todos los sitios

Los géneros están hardcodeados en múltiples lugares que deben mantenerse sincronizados:
- `server/src/routes/upload.routes.js` → `VALID_GENRES`
- `server/src/seed.js` → datos iniciales
- `add-songs.js` → lista de géneros permitidos
- `add-songs-instrucciones.txt` → documentación
- Repositorio `PoetaRivera/pagemusic-storage` → estructura de carpetas

### 2. La DB en tests siempre usa `:memory:`

La condición `process.env.NODE_ENV === 'test'` en `db.js` es lo que activa la DB en memoria. No modificar esta lógica. El flag `NODE_ENV=test` viene de `jest.config.js` (o del script `npm test`).

### 3. `seed.js` no llama `process.exit()`

`seed.js` exporta `seedIfEmpty(db)` — función pura. **No agregar `process.exit()`** ni código que se ejecute al importar el módulo. Esto causaría que Railway mate el proceso al arrancar si la DB ya tiene datos.

### 4. El token del admin se genera solo en `auth.controller.js`

No crear rutas alternativas de login ni endpoints que emitan tokens sin pasar por `bcrypt.compare`. La duración del token es 8h — no reducir sin coordinar con el cliente.

### 5. Validar siempre con Zod antes de escribir en la DB

Todas las rutas POST/PUT deben pasar por `validate(schema)`. No agregar lógica de validación manual en los controllers — extender el schema Zod correspondiente.

### 6. `better-sqlite3` es síncrono — no usar async/await en las queries

Las llamadas a `db.prepare(...).all()`, `.get()`, `.run()` son síncronas. No envolverlas en Promise innecesariamente. Los controllers son síncronos por diseño.

### 7. El frontend llama solo a rutas relativas (`baseURL: '/'`)

`axios.js` usa `baseURL: '/'`. En desarrollo, Vite proxea `/api/*` al servidor. No cambiar a URLs absolutas ni hardcodear dominios en el cliente.

### 8. Las playlists son solo locales

`playlistStore` persiste en `localStorage`. No hay tabla de playlists en la DB. No implementar sincronización de playlists con el servidor sin discutirlo con el usuario primero.

### 9. `client/dist/` se genera en Railway, no se commitea

El build del frontend lo hace Railway en el deploy. `client/dist/` está en `.gitignore`. No commitearlo ni borrarlo del `.gitignore`.

### 10. Variables de entorno de producción solo en Railway

No modificar el archivo `.env` del servidor ni crear `.env.production` en el repo. Las variables de producción están configuradas directamente en el dashboard de Railway.

### 11. Actualizar `siguimiento-fase1.md` al terminar cada sesión

Por instrucción del usuario: al finalizar cualquier tarea, registrar en `siguiendo-fase1.md` qué se completó y por dónde continuar.

### 12. No subir archivos MP3 al repo principal

Los MP3 van exclusivamente a `PoetaRivera/pagemusic-storage` vía Git LFS. El `.gitignore` ya tiene `*.mp3`. No eliminar esa entrada.

### 13. Al agregar un nuevo género

Se deben hacer estos cambios en orden:
1. Crear la carpeta en `pagemusic-storage` y subir los MP3 con LFS
2. Agregar el género a `VALID_GENRES` en `upload.routes.js`
3. Agregar el género a la lista en `add-songs.js`
4. Agregar el género a la lista en `add-songs-instrucciones.txt`
5. Insertar el género en la DB de producción (vía admin panel o `add-songs.js`)

---

*Fin del documento. Para dudas sobre el flujo de audio/LFS, ver `add-songs-instrucciones.txt`.*
