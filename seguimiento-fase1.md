# Seguimiento - PageMusic

## Estado actual: FASE 6 EN PROGRESO - Rediseño visual completado

### Fecha: 2026-04-03

---

## Fase 1: Scaffolding + Base de datos ✅ COMPLETADA
## Fase 2: API REST completa ✅ COMPLETADA
## Fase 3: Frontend público + Reproductor global ✅ COMPLETADA
## Fase 4: Panel de administración ✅ COMPLETADA

### Lo que se hizo en Fase 4
- `client/src/components/admin/GenreForm.jsx` → formulario crear/editar género
- `client/src/components/admin/SongForm.jsx` → formulario crear/editar canción (select de géneros)
- `client/src/components/admin/GenreTable.jsx` → tabla con botones editar/borrar
- `client/src/components/admin/SongTable.jsx` → tabla con badge de género, duración formateada
- `client/src/pages/AdminDashboardPage.jsx` → panel completo con tabs, modales, confirmación de borrado y sección de ayuda GitHub LFS

### Verificación exitosa
- Build: 105 módulos, sin errores ✅
- CRUD géneros: crear, listar, editar, borrar ✅
- CRUD canciones: crear con genre_id, listar con genre_name, borrar ✅
- Protección FK: no se puede borrar género con canciones asignadas ✅
- Confirmación de borrado en modal ✅
- Sección de ayuda con instrucciones GitHub LFS integrada ✅

---

## Cómo usar la aplicación

### Arrancar en desarrollo
```bash
npm run dev   # desde la raíz PAGEMUSIC/
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Credenciales admin (cambiar en server/.env antes de producción)
- Usuario: admin
- Password: admin1234

### Flujo para agregar música
1. Crear repo GitHub público + configurar LFS para .mp3
2. Subir audio: `git add audio/genero/cancion.mp3 && git push`
3. URL del audio: `https://raw.githubusercontent.com/usuario/repo/main/audio/genero/cancion.mp3`
4. Ir a http://localhost:5173/admin → login
5. Crear el género si no existe
6. Agregar canción con la URL del audio

---

## Mejoras post-lanzamiento (2026-04-07)

### Audio fix
- URLs de audio corregidas: `raw.githubusercontent.com` → `media.githubusercontent.com` (LFS servía puntero de texto, no binario)
- `GlobalPlayer`: agregado manejo de error visible, spinner de carga, `onError` en elemento `<audio>`

### Admin - Prioridad 2
- `SongForm`: nuevo toggle URL / Subir archivo. Al subir desde PC, el MP3 se guarda en `server/uploads/[genero]/` y la URL se auto-rellena
- `server/src/routes/upload.routes.js`: endpoint `POST /api/admin/upload?genre=X` con multer (50 MB máx, solo MP3)
- `server/src/app.js`: sirve `server/uploads/` como estático en `/uploads`
- `client/src/api/admin.js`: función `uploadAudio(file, genreName)`

### Prioridad 3: Playlists ✅
- `playlistStore.js`: store Zustand con persist en localStorage (crear, borrar, renombrar, agregar/quitar canciones)
- `PlaylistsPage.jsx`: página `/playlists` con grid de listas, crear nueva, reproducir, borrar
- `PlaylistDetailPage.jsx`: detalle con lista de canciones, renombrar, quitar canciones, reproducir todo
- `SongCard.jsx`: botón `+` con dropdown para agregar a lista existente o crear nueva al vuelo
- `Navbar.jsx` y `App.jsx`: enlace "Mis listas" y rutas `/playlists` y `/playlist/:id`

### Prioridad 4: Mejoras player ✅
- `playerStore.js`: modo repeat (`none/all/one`), persist de `volume/isShuffle/isRepeat`, `showQueue`, `playFromQueue`
- `GlobalPlayer.jsx`: botón repeat (cicla entre los 3 modos, ícono cambia a BsRepeat1 en modo "one"), panel de cola lateral (toggle con BsListUl), `handleEnded` maneja repeat one reiniciando audio directamente

### Pendiente
- Revisión de diseño visual (UI polish)

---

## Fase 5: Deploy producción ✅ COMPLETADA

### Fecha: 2026-04-03

### Lo que se hizo
- `server/src/app.js`: agregado bloque `if (process.env.NODE_ENV === 'production')` que:
  - Sirve los archivos estáticos de `client/dist/` con `express.static`
  - Responde con `index.html` para cualquier ruta no-API (SPA fallback con `app.get('*', ...)`)
  - Importaciones de `path` y `fileURLToPath` agregadas al tope del archivo

### Cómo usar en producción
```bash
npm run build   # genera client/dist/ desde la raíz
npm start       # arranca Express en NODE_ENV=production, sirve frontend + API en un solo proceso
```

### Acceso
- Todo desde: `http://localhost:4000` (o el puerto/dominio configurado)
- No se necesita Vite ni servidor separado en producción

### Deploy sugerido
- **Railway**: conectar repo GitHub, configurar `PORT` como variable de entorno, comando de inicio: `npm start`
- **Render**: Web Service, build command: `npm run build`, start command: `npm start`
- **VPS**: clonar repo, `npm run build`, `npm start` (con PM2 para persistencia)

---

## Fase 6: Rediseño Visual UI/UX - INVESTIGACIÓN COMPLETADA (2026-04-03)

### Estado: Investigación de tendencias terminada. Próximo paso: implementar el nuevo diseño.

### Design Brief - Tendencias UI/UX para PageMusic

#### Qué se investigó
Tendencias 2024-2025 de Spotify, Apple Music, Tidal, YouTube Music, patrones de glassmorphism, dark mode, tipografía, cards de género, player bar, playlists. Se analizó también el código actual del proyecto para contrastar con lo que falta.

---

### 1. PALETA DE COLORES

#### Sistema de colores actual (PageMusic)
- Background: `#111827` (gray-900 de Tailwind)
- Surface: `#1f2937` (gray-800)
- Accent: purple-500/600 (`#8b5cf6` / `#7c3aed`)
- Text: white / gray-400

#### Paleta recomendada (inspirada en Spotify + tendencias 2025)

| Rol | Color actual | Color recomendado | Hex |
|-----|-------------|-------------------|-----|
| Background base | gray-900 | Deep dark (no negro puro) | `#0d0d0f` |
| Surface 1 | gray-800 | Surface elevada | `#161618` |
| Surface 2 | gray-700 | Card surface | `#1e1e22` |
| Surface hover | gray-750 | Hover state | `#28282e` |
| Accent primario | purple-500 | Violeta eléctrico | `#8b5cf6` |
| Accent secundario | - | Cyan/teal para waveforms | `#22d3ee` |
| Accent glow | - | Glow color | `rgba(139,92,246,0.3)` |
| Text primario | white | Off-white (menos strain) | `#f1f1f3` |
| Text secundario | gray-400 | Gris suave | `#a1a1aa` |
| Text muted | gray-500 | Gris más oscuro | `#71717a` |
| Border sutil | gray-800 | Border muy sutil | `rgba(255,255,255,0.06)` |

**Nota clave**: No usar negro puro (`#000000`) como fondo. El `#0d0d0f` es más suave y moderno.
**Spotify usa**: `#191414` (base), `#1DB954` (verde). PageMusic mantiene bien el violeta como identidad propia.

#### Acentos opcionales por género (como Spotify Aura)
- Rock → rojo/naranja: `#ef4444`
- Jazz → azul índigo: `#6366f1`
- Electrónica → cyan: `#22d3ee`
- Pop → rosa: `#ec4899`
- Clásica → dorado: `#f59e0b`

---

### 2. TIPOGRAFÍA

#### Recomendación principal: **Inter** (ya instalada en muchos proyectos Tailwind)
- Alternativa premium: **Geist Sans** (diseñada para UI, muy limpia)
- Alternativa con personalidad: **Space Grotesk** (técnica, moderna, buena para música)

#### Sistema tipográfico recomendado

```
H1 (Títulos de página):   font-size: 2rem (32px), font-weight: 700, letter-spacing: -0.02em
H2 (Secciones):           font-size: 1.5rem (24px), font-weight: 700
H3 (Cards/nombres):       font-size: 1rem (16px), font-weight: 600
Body:                     font-size: 0.875rem (14px), font-weight: 400
Small/Meta:               font-size: 0.75rem (12px), font-weight: 400, color: muted
```

**Regla de oro**: Solo usar 1 familia tipográfica, variar solo peso y tamaño. Nunca mezclar 2 familias en una app de música.

**Práctica actual de PageMusic**: Bien encaminado. Falta reducir `letter-spacing` en títulos y agregar `tracking-tight` en H1.

---

### 3. LAYOUT GENERAL

#### Patrón recomendado: Sidebar + Main content + Bottom player

```
┌──────────────────────────────────────────────────────────┐
│  NAVBAR (sticky top, height: 60px)                       │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  SIDEBAR   │        MAIN CONTENT                         │
│  (240px)   │        (scrollable)                         │
│  colaps.   │                                             │
│  a 64px    │                                             │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  BOTTOM PLAYER BAR (fixed, height: 72-80px)              │
└──────────────────────────────────────────────────────────┘
```

**Estado actual de PageMusic**: Solo tiene Navbar top + content. No tiene sidebar lateral.
**Mejora sugerida**: Mover la navegación principal a un sidebar izquierdo colapsable (240px expandido / 64px iconos). Esto libera el Navbar para solo tener logo + búsqueda.

#### Sidebar - contenido sugerido
- Logo PageMusic (arriba)
- Inicio / Géneros
- Mis listas (playlists)
- Separador
- (Admin) si es admin
- Botón colapsar (abajo)

---

### 4. GENRE CARDS - MEJORAS CONCRETAS

#### Estado actual
```jsx
// GenreCard.jsx actual:
bg-gray-800 rounded-lg hover:ring-2 hover:ring-purple-500
// Imagen: aspect-square, scale-105 en hover
// Sin efecto de profundidad, sin gradient overlay en imagen
```

#### Mejoras recomendadas

1. **Gradient overlay en la imagen**: agregar un degradado `from-transparent to-black/60` encima de la imagen para que el nombre del género sea legible directo sobre la imagen (sin la caja gris debajo).

2. **Nombre del género sobre la imagen** (no debajo): posición absoluta en la parte inferior de la imagen. Más compacto y visual.

3. **Hover effect mejorado**: en lugar de solo `ring`, agregar `translateY(-4px)` + `shadow-lg shadow-purple-500/20` para que "floten" un poco.

4. **Sin imágenes → Gradient dinámico**: en lugar del fondo plano `gray-700`, asignar un gradiente único por género usando colores deterministas (basado en el nombre del género como seed).

5. **Tamaño del grid**: Bien calibrado actualmente (3→7 columnas según breakpoint). Mantener.

```jsx
// Patrón recomendado para GenreCard
<div className="group relative rounded-xl overflow-hidden cursor-pointer
  transition-all duration-300 hover:-translate-y-1
  hover:shadow-xl hover:shadow-purple-500/20">

  {/* imagen */}
  <div className="aspect-square">
    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    {/* overlay siempre visible */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
    {/* nombre SOBRE la imagen */}
    <h3 className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold truncate">
      {genre.name}
    </h3>
    {/* play button en hover */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-purple-500 rounded-full p-2 shadow-lg shadow-purple-500/50">
        <BsPlayFill className="text-white text-xl" />
      </div>
    </div>
  </div>
</div>
```

---

### 5. BOTTOM PLAYER BAR - MEJORAS CONCRETAS

#### Estado actual
```
bg-gray-900 border-t border-gray-800 px-4 py-3
Layout: [info canción 56px] [controles centrales flex-1] [volumen+cola 160px]
Play button: w-9 h-9 bg-white rounded-full
Progress: input range h-1 accent-purple-500
```

#### Lo que hacen Spotify / Tidal / YouTube Music
- **Altura**: 72-80px (el actual ~56px es algo corto)
- **Glassmorphism**: `backdrop-filter: blur(20px)` + fondo semitransparente. Crea sensación de "flotar" sobre el contenido.
- **Separador superior**: no solo `border-t`, sino también un `box-shadow` hacia arriba.
- **Play button**: más grande (40-44px), con `box-shadow` glow del color accent.
- **Progress bar**: más gruesa en hover (h-1 → h-1.5 en hover), con `transition` suave.
- **Album art**: más grande en el player (actualmente 40px, subir a 48-52px) con `rounded-md`.
- **Tidal trend (2026)**: imagen sin border-radius (cuadrada), fondo dinámico según álbum.

#### Mejora glassmorphism recomendada

```css
/* Reemplazar bg-gray-900 con: */
background: rgba(13, 13, 15, 0.85);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-top: 1px solid rgba(255, 255, 255, 0.06);
box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
```

#### Play button con glow

```css
/* Play button */
background: #8b5cf6; /* en lugar de white */
box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
border-radius: 50%;
width: 40px; height: 40px;
```

#### Layout mejorado del player bar

```
┌─────────────────────────────────────────────────────────────────┐
│  [img 48px] [Título / Artista]  ♡   │  ⏮  ⏭  [⏵]  ⏭  🔁  🔀  │  🔉 ─────  ☰ │
│                                     │  0:00 ──────────── 3:45   │              │
└─────────────────────────────────────────────────────────────────┘
  ← info song (w-64) →              ← controles (flex-1 center) →    ← extras →
```

**Agregar**: botón de like/favorito (♡) junto a la info de canción. Es un elemento estándar en todos los players modernos.

---

### 6. PLAYLIST UI - MEJORAS CONCRETAS

#### Estado actual
```
Grid 1→2→3 columnas
Card: bg-gray-800 rounded-xl p-5
Gradient fijo: from-purple-900 to-gray-700 (igual para todas)
```

#### Mejoras recomendadas

1. **Gradient único por playlist**: cada playlist debería tener un color de acento diferente para identificación visual rápida. Se puede hacer con un array de gradients preestablecidos rotando por índice.

2. **Collage de covers**: si la playlist tiene canciones con `cover_url`, mostrar un collage de las primeras 4 en cuadrícula 2x2 dentro de la card. Mucho más visual que el ícono genérico.

3. **Hover state con overlay play**: igual que GenreCard, un botón de play que aparece en hover sobre la imagen de la playlist.

4. **En la página de detalle de playlist**: cambiar el layout a columna tipo "álbum" con:
   - Header grande con la imagen/collage + nombre + metadata (N canciones, duración total)
   - Lista de canciones debajo con números de pista
   - Botón "Reproducir todo" prominente en el header

```jsx
// Gradients rotativos para playlists
const PLAYLIST_GRADIENTS = [
  'from-purple-900 to-indigo-900',
  'from-blue-900 to-cyan-900',
  'from-rose-900 to-pink-900',
  'from-amber-900 to-orange-900',
  'from-emerald-900 to-teal-900',
  'from-violet-900 to-purple-900',
]
// Usar: PLAYLIST_GRADIENTS[index % PLAYLIST_GRADIENTS.length]
```

---

### 7. EFECTOS VISUALES MODERNOS

#### Glassmorphism (tendencia dominante 2024-2025)
- Usar en: player bar, panel de cola (queue), dropdowns, modales
- Técnica: `backdrop-filter: blur(16-20px)` + fondo `rgba` semitransparente + border `rgba(255,255,255,0.08)`
- Tailwind CSS 3+: `backdrop-blur-xl bg-black/70 border border-white/10`

#### Dynamic color extraction (tendencia Spotify/Tidal/YouTube)
- Extraer color dominante del album art con `colorthief` o `vibrant.js`
- Aplicar como fondo degradado suave en el Now Playing / player bar
- Ejemplo: cuando suena una canción con cover azul, el fondo del player se tiñe ligeramente de azul
- Implementación en React: `useEffect` que corre al cambiar `currentSong`, extrae color, aplica via CSS variable

#### Microinteractions
- Cards: `transition-all duration-300` (ya existe, bien)
- Play button: `hover:scale-110 active:scale-95` (pequeño "bounce" al hacer click)
- Iconos de control: `hover:text-white transition-colors duration-150` (ya existe)
- Progress bar: thicken en hover con CSS `:hover` en el input range
- Canción activa en lista: pulso/glow animado sutil en el indicador

#### Gradientes de fondo seccionales
- En `HomePage`: en lugar de fondo plano, un gradiente muy sutil radial en la esquina superior:
  ```css
  background: radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.08) 0%, transparent 60%);
  ```

---

### 8. SONG LIST / CATALOG ROWS - MEJORAS

#### Estado actual (SongCard.jsx)
- Layout: `flex items-center gap-4 p-3 rounded-lg`
- Activo: `bg-purple-900/40 ring-1 ring-purple-500`
- Hover: `hover:bg-gray-800`

#### Mejoras
1. **Número de pista**: agregar número a la izquierda (como Spotify). En hover, el número se convierte en ícono de play.
2. **Indicador de reproducción activo**: animación de equalizer (3 barras que suben/bajan) cuando la canción está reproduciéndose, en lugar del simple `▶` o texto en morado.
3. **Like button**: ícono de corazón vacío/relleno visible en hover (como Spotify).
4. **Duración**: ya está bien posicionada a la derecha.

---

### 9. NAVBAR - MEJORAS

#### Estado actual
```
bg-gray-900 border-b border-gray-800 sticky top-0
Logo | Search input (w-64) | Links de nav
```

#### Mejoras
1. **Glassmorphism en navbar**: `backdrop-blur-md bg-gray-900/80` en lugar de opaco.
2. **Search bar mejorada**: más ancha (w-80), con ícono de búsqueda a la izquierda dentro del input, borde más suave.
3. **Con sidebar**: si se agrega sidebar, el navbar solo necesitaría el logo (izquierda) y la search + avatar (derecha), muy limpio.
4. **Indicador de canción reproduciéndose**: en mobile/desktop reducido, mostrar un mini indicador de qué está sonando en el navbar.

---

### 10. DARK MODE - COLORES SUPERFICIALES (ELEVATION SYSTEM)

Inspirado en Material Design + tendencias 2025. A mayor elevación (z-index), más claro el fondo:

| Capa | Color | Uso |
|------|-------|-----|
| Base (nivel 0) | `#0d0d0f` | Body background |
| Nivel 1 | `#161618` | Sidebar, player bar |
| Nivel 2 | `#1e1e22` | Cards, inputs |
| Nivel 3 | `#26262c` | Hover states, dropdowns |
| Nivel 4 | `#2e2e36` | Modales, tooltips |
| Overlay | `rgba(0,0,0,0.7)` | Backdrops de modal |

---

---

## Fase 6: Rediseño Visual - IMPLEMENTACIÓN COMPLETADA (2026-04-03)

### Lo que se implementó

**Paso 1 ✅ - `index.css`**: Sistema de variables CSS globales
- Paleta completa: `--bg-base`, `--bg-surface1/2`, `--bg-hover`, `--accent`, `--accent-glow`, `--text-primary/secondary/muted`, `--border`
- Scrollbar personalizado sutil
- Inputs `type="range"` con track h-4px, thumb circular, aparece en hover
- Keyframes `eq1/eq2/eq3` + clase `.equalizer` para animación de barras de ecualización

**Paso 2 ✅ - `GlobalPlayer.jsx`**: Glassmorphism + nueva UI
- Barra de player: `rgba(13,13,15,0.85)` + `backdropFilter: blur(24px)`, minHeight 76px
- Play button: morado con glow (`var(--accent)`, `boxShadow: 0 0 20px var(--accent-glow)`)
- Panel de cola: glass panel fijo justo arriba del player, con equalizer animado en canción activa
- Todos los colores migrados a variables CSS

**Paso 3 ✅ - `GenreCard.jsx`**: Nombre sobre imagen
- Overlay degradado permanente `from-black/70 via-black/10 to-transparent`
- Nombre en posición absoluta sobre la imagen
- Sin imágenes → gradiente determinista según hash del nombre
- Hover: `translateY(-4px)` + sombra violeta

**Paso 4 ✅ - `Sidebar.jsx`** (nuevo) + **`App.jsx`** (refactorizado)
- Sidebar colapsable 220px ↔ 64px con chevron toggle
- NavLinks: Inicio, Mis listas, Panel admin (si admin)
- Tooltips en modo colapsado
- Logout button si admin
- App.jsx restructurado: Navbar top + Sidebar left + main scrollable + GlobalPlayer fixed

**Paso 5 ✅ - `Navbar.jsx`** simplificado
- Solo barra de búsqueda centrada con glassmorphism
- Removidas todas las rutas (ahora en Sidebar)
- Input con ícono de lupa, border morado en focus, resultados con glass dropdown

**Paso 6 ✅ - `SongCard.jsx`** rediseñado
- Columna izquierda: número de pista → play button circular en hover → equalizer si activa
- Tamaño cover reducido a 40px
- Dropdown de playlists con glass styling

**Paso 7 ✅ - `SongList.jsx`**: pasa `index` a cada SongCard

**Paso 8 ✅ - `PlaylistsPage.jsx`** rediseñado
- Grid 2→5 columnas adaptativo
- Cover collage 2x2 si ≥4 canciones con portada
- Gradientes únicos rotativos por playlist
- Play button en hover sobre la portada

**Paso 9 ✅ - `PlaylistDetailPage.jsx`** rediseñado
- Header Spotify-style: portada grande (160px) + título gigante + metadata + botones Reproducir / Aleatorio / Eliminar
- Canciones via SongCard con botón eliminar externo

**Paso 10 ✅ - `GenrePage.jsx`** y **`HomePage.jsx`** migrados a variables CSS
- GenrePage: mismo layout de header Spotify-style con portada + botones Reproducir / Aleatorio

---

---

## Estadísticas de reproducción ✅ COMPLETADO (2026-04-08)

### Backend
- `db.js`: nueva tabla `plays (id, song_id, played_at, duration_listened, completed, skipped)`
- `stats.controller.js`: endpoints `recordPlay`, `topSongs`, `topGenres`, `byHour`, `byWeekday`, `mostSkipped`, `summary`
- `stats.routes.js`: `POST /api/stats/plays` (público), resto protegido con `requireAdmin`
- `app.js`: registrada la ruta `/api/stats`

### Frontend
- `api/stats.js`: funciones para todos los endpoints
- `GlobalPlayer.jsx`: lógica de sesión con `playSessionRef` — registra al cambiar canción o al terminar, detecta skip si escuchó menos del 80%
- `AdminDashboardPage.jsx`: nueva tab "Estadísticas" con:
  - Cards de resumen (total plays, hoy, semana, canciones únicas, completadas, tasa)
  - Top 10 canciones
  - Top géneros con barra de progreso proporcional
  - Gráfico de barras por hora del día (0-23h)
  - Gráfico de barras por día de la semana
  - Tabla de canciones más saltadas (solo si ≥3 reproducciones)

### Auto-duración también activo
- `songs.controller.js`: `patchDuration` — actualiza duración si estaba vacía
- `GlobalPlayer.jsx`: llama `patchSongDuration` en `onLoadedMetadata` si `!currentSong.duration`
- `songs.routes.js`: `PATCH /:id/duration`

### POR DÓNDE SEGUIR (opcional)

1. **Dynamic color extraction**: `colorthief` para teñir el fondo del player según el album art.
2. **AdminDashboardPage/LoginPage**: migrar colores hardcoded a variables CSS.
3. **Deploy**: subir a Railway o Render.
