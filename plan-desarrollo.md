# Plan de Desarrollo - PageMusic

## Arquitectura general

- **Frontend:** React + Vite + Tailwind CSS + Zustand + React Router v6
- **Backend:** Node.js + Express + SQLite (better-sqlite3) + JWT + Zod
- **Storage:** GitHub LFS (.mp3) + GitHub raw (covers .jpg/png)
- **Acceso:** Streaming público sin auth para oyentes, admin con JWT
- **Contenido:** Canciones organizadas por géneros (Salsa, Pop Rock, etc.)
- **Player:** Global, fijo en bottom-0, con cola, shuffle y controles básicos

---

## Estructura de carpetas

```
PAGEMUSIC/
├── .gitignore
├── package.json              # scripts raiz: dev:server, dev:client, dev
├── plan-desarrollo.md
├── seguimiento-fase1.md
│
├── server/
│   ├── package.json
│   ├── .env                  # NO commitear
│   ├── .env.example
│   └── src/
│       ├── index.js          # Puerto, arranque del servidor
│       ├── app.js            # Express, middlewares, rutas
│       ├── config.js         # Variables de entorno exportadas
│       ├── db.js             # Conexión SQLite + creación de tablas + seed admin
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── genres.controller.js
│       │   └── songs.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── genres.routes.js
│       │   └── songs.routes.js
│       ├── middlewares/
│       │   ├── auth.middleware.js       # Verifica JWT Bearer
│       │   └── validator.middleware.js  # Zod schema validation
│       └── schemas/
│           ├── auth.schema.js
│           ├── genre.schema.js
│           └── song.schema.js
│   └── database/
│       └── pagemusic.db      # Generado automáticamente, NO commitear
│
└── client/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.cjs
    ├── postcss.config.cjs
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   ├── axios.js
        │   ├── songs.js
        │   ├── genres.js
        │   ├── auth.js
        │   └── admin.js
        ├── store/
        │   ├── playerStore.js    # Zustand: cola, shuffle, volumen, progreso
        │   └── adminStore.js     # Zustand persist: token JWT admin
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   ├── player/
        │   │   ├── GlobalPlayer.jsx
        │   │   ├── ProgressBar.jsx
        │   │   ├── VolumeControl.jsx
        │   │   └── PlayerControls.jsx
        │   ├── catalog/
        │   │   ├── GenreCard.jsx
        │   │   ├── SongCard.jsx
        │   │   └── SongList.jsx
        │   ├── admin/
        │   │   ├── GenreForm.jsx
        │   │   ├── SongForm.jsx
        │   │   ├── GenreTable.jsx
        │   │   └── SongTable.jsx
        │   └── ui/
        │       ├── Button.jsx
        │       ├── Modal.jsx
        │       └── Spinner.jsx
        └── pages/
            ├── HomePage.jsx
            ├── GenrePage.jsx
            ├── AdminLoginPage.jsx
            └── AdminDashboardPage.jsx
```

---

## Fase 1: Scaffolding + Base de Datos

### Objetivo
Tener la estructura de carpetas completa, ambos servidores corriendo sin errores, y la base de datos SQLite con esquema funcional.

### Decisiones técnicas

**Por qué `better-sqlite3`:** Es síncrono, lo que simplifica los controladores Express. No hay callbacks ni promesas para las queries. Para un catálogo musical pequeño no hay penalización de rendimiento.

**Por qué ESModules (`"type": "module"`):** Consistencia con el cliente React. Permite `import/export` en todo el stack.

**Por qué proxy Vite en dev:** El cliente llama a `/api/...` en el mismo origen. En producción, Express sirve el `dist/` del cliente, así que no hay CORS en absoluto.

### server/package.json

```json
{
  "name": "pagemusic-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon src/index.js",
    "start": "cross-env NODE_ENV=production node src/index.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.4.3",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "morgan": "^1.10.0",
    "zod": "^3.21.4"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "dotenv": "^16.3.1",
    "nodemon": "^3.0.2"
  }
}
```

### Esquema SQLite (server/src/db.js)

```sql
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration INTEGER,           -- en segundos (nullable)
  audio_url TEXT NOT NULL,    -- URL raw de GitHub LFS
  cover_url TEXT,             -- URL raw de GitHub /covers
  genre_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);
```

**Seed del admin:** Al arrancar, si la tabla `admin` está vacía, leer `ADMIN_USERNAME` y `ADMIN_PASSWORD` del `.env`, hashear con `bcrypt.hashSync` e insertar. El admin se auto-crea la primera vez.

### server/.env

```
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=reemplaza_esto_con_secreto_largo
ADMIN_USERNAME=admin
ADMIN_PASSWORD=reemplaza_con_password_fuerte
```

### client/vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

### Dependencias del cliente

```
npm install zustand axios react-router-dom react-icons zod
npm install -D tailwindcss postcss autoprefixer
```

### package.json raíz

```json
{
  "name": "pagemusic",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "install:all": "cd server && npm install && cd ../client && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### .gitignore raíz

```
node_modules/
server/node_modules/
client/node_modules/
server/.env
server/database/pagemusic.db
client/dist/
*.mp3
```

### Verificación de Fase 1
- `npm run dev` arranca ambos procesos sin errores
- `GET http://localhost:4000/api/genres` retorna `[]`
- `GET http://localhost:5173` muestra la página React base
- Archivo `pagemusic.db` se crea en `server/database/`

---

## Fase 2: API REST Completa

### Objetivo
Todos los endpoints funcionando y testeables con un cliente HTTP (Thunder Client, curl, Postman).

### Decisiones técnicas

**Por qué un solo admin hardcodeado:** No hay registro de nuevos admins ni recuperación de contraseña. Un único registro en la tabla `admin` es suficiente.

**Por qué `Authorization: Bearer` en lugar de cookies:** El panel admin es una SPA. Con Bearer token en localStorage (solo para admin), el flujo es más simple y evita problemas de `sameSite`/`secure` en desarrollo local.

**Por qué Zod:** Schemas reutilizables en frontend y backend, mensajes de error consistentes.

### Endpoints

```
# Públicos
GET    /api/genres                -> lista todos los géneros
GET    /api/genres/:id/songs      -> canciones de un género
GET    /api/songs                 -> lista todas las canciones (con genre_name)

# Auth
POST   /api/admin/login           -> retorna JWT
GET    /api/admin/verify          -> verifica token activo

# Admin (requieren JWT)
POST   /api/admin/genres          -> crear género
PUT    /api/admin/genres/:id      -> editar género
DELETE /api/admin/genres/:id      -> borrar género (falla si tiene canciones)
POST   /api/admin/songs           -> crear canción
PUT    /api/admin/songs/:id       -> editar canción
DELETE /api/admin/songs/:id       -> borrar canción
```

### auth.middleware.js

```js
export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
```

### Schemas Zod

```js
// song.schema.js
export const songSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().optional(),
  duration: z.number().int().positive().optional(),
  audio_url: z.string().url(),
  cover_url: z.string().url().optional(),
  genre_id: z.number().int().positive()
});

// genre.schema.js
export const genreSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  cover_url: z.string().url().optional()
});
```

### Verificación de Fase 2
- `POST /api/admin/login` con credenciales correctas retorna JWT
- `POST /api/admin/login` con credenciales incorrectas retorna 400
- `GET /api/genres` retorna `[]` inicialmente
- `POST /api/admin/genres` sin token retorna 401
- `POST /api/admin/genres` con token crea y retorna el género
- `GET /api/genres` ahora retorna el género creado
- `POST /api/admin/songs` con token y genre_id válido crea la canción
- `GET /api/songs` retorna la canción con `genre_name` incluido

---

## Fase 3: Frontend Público + Reproductor Global

### Objetivo
La app pública completamente funcional: navegar géneros, ver canciones, reproducir audio con reproductor global persistente.

### Decisiones técnicas

**Por qué Zustand para el player:** Re-renders selectivos por suscripción. El reproductor tiene actualizaciones frecuentes (progreso cada segundo). Context API causaría re-renders de todos los consumidores.

**Por qué `<audio>` HTML nativo:** Soporta streaming HTTP nativo. GitHub sirve archivos LFS con headers correctos para streaming progresivo. No se necesita Howler.js u otras librerías.

**Por qué `fixed bottom-0` y no sticky:** `sticky` desaparecería al hacer scroll. `fixed bottom-0` garantiza visibilidad constante. El contenido principal necesita `pb-24` para no quedar oculto.

### playerStore.js (Zustand)

```js
import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  queue: [],
  originalQueue: [],
  isPlaying: false,
  isShuffle: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,

  playSong: (song, queue) => {
    const shuffled = get().isShuffle ? shuffle([...queue]) : queue;
    set({ currentSong: song, queue: shuffled, originalQueue: queue, isPlaying: true });
  },
  playNext: () => {
    const { queue, currentSong } = get();
    const idx = queue.findIndex(s => s.id === currentSong.id);
    const next = queue[idx + 1] || queue[0];
    set({ currentSong: next, isPlaying: true });
  },
  playPrev: () => {
    const { queue, currentSong } = get();
    const idx = queue.findIndex(s => s.id === currentSong.id);
    const prev = queue[idx - 1] || queue[queue.length - 1];
    set({ currentSong: prev, isPlaying: true });
  },
  toggleShuffle: () => {
    const { isShuffle, originalQueue, currentSong } = get();
    if (!isShuffle) {
      set({ isShuffle: true, queue: shuffle([...originalQueue]) });
    } else {
      set({ isShuffle: false, queue: originalQueue });
    }
  },
  togglePlay: () => set(s => ({ isPlaying: !s.isPlaying })),
  setVolume: (v) => set({ volume: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
}))

// Fisher-Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

### App.jsx

```jsx
<BrowserRouter>
  <Navbar />
  <main className="pb-24 min-h-screen bg-gray-900 text-white">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/genre/:id" element={<GenrePage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  </main>
  <GlobalPlayer />
</BrowserRouter>
```

### GlobalPlayer.jsx

- Contiene el `<audio ref={audioRef}>` real
- `useEffect` cuando `currentSong` cambia: actualiza `src`, llama `play()`
- Eventos nativos conectados al store:
  - `ontimeupdate` → `setCurrentTime`
  - `onended` → `playNext`
  - `onloadedmetadata` → `setDuration`
- Posición: `fixed bottom-0 w-full bg-gray-800 border-t border-gray-700`

### API calls del cliente

```js
// api/axios.js
import axios from 'axios'
const api = axios.create({ baseURL: '/' })
api.interceptors.request.use(config => {
  const token = useAdminStore.getState().token  // getState() funciona fuera de componentes
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export default api
```

### Páginas

- **HomePage:** Grid de `GenreCard` con géneros. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **GenrePage:** Lista de canciones del género. Click en canción → `playSong(song, songs)`
- **GenreCard:** Imagen del género, nombre, link a `/genre/:id`
- **SongCard:** Cover art, título, artista, duración, botón play. Indicador visual si es `currentSong`

### UI/UX

- Dark theme: `bg-gray-900`, `bg-gray-800` con acentos
- Cover art fallback: icono de nota musical si `cover_url` es null
- Loading: skeleton con `animate-pulse` mientras carga la API
- Duración: función `formatDuration(seconds)` → `"3:42"`

### Verificación de Fase 3
- Home muestra tarjetas de géneros
- Click en género navega a lista de canciones
- Click en canción → player inferior aparece y reproduce
- Controles play/pause, siguiente, anterior funcionan
- Barra de progreso avanza y se puede arrastrar (seek)
- Volumen ajustable
- Shuffle mezcla el orden de la cola

---

## Fase 4: Panel de Administración + GitHub LFS

### Objetivo
Admin panel completamente funcional con CRUD de canciones y géneros, y documentación del flujo para subir archivos via GitHub LFS.

### adminStore.js (Zustand con persist)

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAdmin: false,
      login: (token, username) => set({ token, username, isAdmin: true }),
      logout: () => set({ token: null, username: null, isAdmin: false }),
    }),
    { name: 'admin-storage' }  // persiste en localStorage
  )
)
```

**Interceptor de respuesta Axios:** Detecta 401 → llama `logout()` → redirige al login.

### AdminProtectedRoute

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'
export const AdminProtectedRoute = () => {
  const { isAdmin } = useAdminStore()
  return isAdmin ? <Outlet /> : <Navigate to="/admin" />
}
```

### AdminDashboardPage

Tabs: "Géneros" | "Canciones"

**CRUD Géneros - campos del formulario:**
- nombre (requerido)
- descripción (opcional)
- cover_url (URL de imagen, opcional)

**CRUD Canciones - campos del formulario:**
- Título (requerido)
- Artista (requerido)
- Álbum (opcional)
- Duración en segundos (número, opcional)
- URL del audio (requerido - URL raw de GitHub LFS)
- URL del cover (opcional - URL raw de GitHub /covers)
- Género (select dropdown, carga los géneros del API)

**Patrón de estado admin:** `useState` local para listas. Tras crear/editar/borrar: recargar lista. No se necesita store de Zustand para el CRUD.

### Flujo GitHub LFS (documentado en el panel)

**Paso 1 - Configurar el repositorio de almacenamiento:**
```bash
git clone https://github.com/usuario/pagemusic-storage.git
cd pagemusic-storage
git lfs install
git lfs track "*.mp3"
git add .gitattributes
git commit -m "Configure LFS for mp3"
git push
```

**Paso 2 - Subir un archivo de audio:**
```bash
cp /ruta/cancion.mp3 ./audio/genero/
git add audio/genero/cancion.mp3
git commit -m "Add: Artista - Titulo.mp3"
git push
```
URL resultante:
`https://raw.githubusercontent.com/usuario/pagemusic-storage/main/audio/genero/cancion.mp3`

**Paso 3 - Subir cover art:**
```bash
cp /ruta/cover.jpg ./covers/
git add covers/artista-titulo.jpg
git commit -m "Add cover: Artista - Titulo"
git push
```
URL resultante:
`https://raw.githubusercontent.com/usuario/pagemusic-storage/main/covers/artista-titulo.jpg`

**Paso 4 - Registrar en el panel:**
Con las URLs copiadas, ir al admin panel → "Agregar Canción" → pegar URLs en los campos correspondientes.

> **Límite GitHub LFS gratuito:** 1 GB de almacenamiento y 1 GB/mes de ancho de banda. Aprox. 50-100 canciones en MP3 a buena calidad.

### api/admin.js

```js
import api from './axios'
export const createGenre = (data) => api.post('/api/admin/genres', data)
export const updateGenre = (id, data) => api.put(`/api/admin/genres/${id}`, data)
export const deleteGenre = (id) => api.delete(`/api/admin/genres/${id}`)
export const createSong = (data) => api.post('/api/admin/songs', data)
export const updateSong = (id, data) => api.put(`/api/admin/songs/${id}`, data)
export const deleteSong = (id) => api.delete(`/api/admin/songs/${id}`)
```

### Verificación de Fase 4
- Login admin funciona con credenciales del `.env`
- Recarga de página mantiene la sesión (Zustand persist)
- Crear un género aparece en la homepage pública
- Crear una canción con URLs de GitHub se puede reproducir
- Editar y borrar funcionan correctamente
- 401 al expirar token redirige al login

---

## Fase 5 (Opcional): Producción

### Objetivo
Un solo proceso Express sirviendo frontend y API.

### server/src/app.js (modo producción)

```js
if (process.env.NODE_ENV === 'production') {
  const { default: path } = await import('path')
  const { fileURLToPath } = await import('url')
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  app.use(express.static(path.join(__dirname, '../../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
  })
}
```

### Middleware de errores global

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})
```

### Scripts de producción

```bash
npm run build   # genera client/dist/
npm start       # arranca Express en producción
```

---

## Archivos críticos

| Archivo | Importancia |
|---------|-------------|
| `server/src/db.js` | Esquema SQLite + seed del admin. Base de todo el backend. |
| `server/src/app.js` | Express, middlewares, montaje de rutas. |
| `client/src/store/playerStore.js` | Lógica más compleja: cola, shuffle, estado del audio. |
| `client/src/components/player/GlobalPlayer.jsx` | Conecta `<audio>` nativo con el store y los controles visuales. |
| `client/src/store/adminStore.js` | Sesión admin persistente + interceptor Axios para JWT. |

---

## Resumen de fases

| Fase | Entregable |
|------|------------|
| 1: Scaffolding + SQLite | Ambos servidores corriendo, DB creada |
| 2: API REST completa | Todos los endpoints testeables |
| 3: Frontend público + Player | App pública funcional con audio |
| 4: Admin panel + LFS | CRUD completo desde la web |
| 5 (opcional): Producción | Build y deploy desde un solo proceso |

**Dependencias entre fases:**
- Fase 2 requiere Fase 1
- Fase 3 requiere los endpoints públicos de Fase 2
- Fase 4 requiere los endpoints admin de Fase 2
- Fase 3 y Fase 4 pueden desarrollarse en paralelo
- Fase 5 requiere Fases 3 y 4 completas
