/**
 * Script: upload-declamado.js
 * Sube los 34 poemas declamados a la aplicación PageMusic.
 *
 * Uso:
 *   node scripts/upload-declamado.js                        (producción)
 *   node scripts/upload-declamado.js --local                (localhost:4000)
 *   node scripts/upload-declamado.js --url http://mi-url    (URL custom)
 */

import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Configuración ──────────────────────────────────────────────────────────
const AUDIO_DIR   = 'C:/CARPETA-RESPALDO/OneDrive/MUSICA-POEMAS/audios/mp3/declamado'
const ARTIST      = 'PoetaRivera'
const GENRE_NAME  = 'declamado'

const args = process.argv.slice(2)
let BASE_URL = 'https://pagemusic-production.up.railway.app'
if (args.includes('--local')) BASE_URL = 'http://localhost:4000'
const urlFlag = args.indexOf('--url')
if (urlFlag !== -1 && args[urlFlag + 1]) BASE_URL = args[urlFlag + 1]

// Credenciales: --user y --pass como argumentos, o variables de entorno
const userFlag = args.indexOf('--user')
const passFlag = args.indexOf('--pass')
const ADMIN_USER = (userFlag !== -1 && args[userFlag + 1]) ? args[userFlag + 1] : (process.env.ADMIN_USERNAME || 'admin')
const ADMIN_PASS = (passFlag !== -1 && args[passFlag + 1]) ? args[passFlag + 1] : (process.env.ADMIN_PASSWORD || 'admin1234')

// ── Helpers ────────────────────────────────────────────────────────────────

function extractTitle(filename) {
  // "Al maestro-ryp-declamado.mp3" → "Al maestro"
  return filename
    .replace(/-ryp-declamado\.mp3$/i, '')
    .replace(/\.mp3$/i, '')
    .trim()
}

async function login() {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Login fallido: ${err.message || res.status}`)
  }
  const { token } = await res.json()
  return token
}

async function getOrCreateGenre(token) {
  const res = await fetch(`${BASE_URL}/api/genres`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const genres = await res.json()
  const existing = genres.find(g => g.name.toLowerCase() === GENRE_NAME.toLowerCase())
  if (existing) {
    console.log(`✓ Género "${GENRE_NAME}" ya existe (id: ${existing.id})`)
    return existing
  }

  const create = await fetch(`${BASE_URL}/api/genres`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: GENRE_NAME, description: 'Poemas declamados' }),
  })
  if (!create.ok) {
    const err = await create.json().catch(() => ({}))
    throw new Error(`No se pudo crear el género: ${err.message || create.status}`)
  }
  const genre = await create.json()
  console.log(`✓ Género "${GENRE_NAME}" creado (id: ${genre.id})`)
  return genre
}

async function uploadFile(token, filePath, filename) {
  const buffer = readFileSync(filePath)
  const formData = new FormData()
  formData.append('audio', new File([buffer], filename, { type: 'audio/mpeg' }))

  const res = await fetch(`${BASE_URL}/api/admin/upload?genre=${GENRE_NAME}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Upload fallido: ${err.message || res.status}`)
  }
  return res.json() // { url, filename, genre }
}

async function createSong(token, { title, audioUrl, genreId }) {
  const res = await fetch(`${BASE_URL}/api/songs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      artist: ARTIST,
      audio_url: audioUrl,
      genre_id: genreId,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Canción no creada: ${err.message || res.status}`)
  }
  return res.json()
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🎙 Upload de poemas declamados → ${BASE_URL}\n`)

  // 1. Login
  console.log('Iniciando sesión...')
  const token = await login()
  console.log('✓ Sesión iniciada\n')

  // 2. Género
  const genre = await getOrCreateGenre(token)
  console.log()

  // 3. Leer archivos
  const files = readdirSync(AUDIO_DIR).filter(f => f.toLowerCase().endsWith('.mp3'))
  console.log(`Archivos encontrados: ${files.length}\n`)

  let ok = 0
  let fail = 0

  for (const filename of files) {
    const title = extractTitle(filename)
    const filePath = path.join(AUDIO_DIR, filename)

    process.stdout.write(`  Subiendo: ${title}...`)
    try {
      const { url } = await uploadFile(token, filePath, filename)
      await createSong(token, { title, audioUrl: url, genreId: genre.id })
      console.log(' ✓')
      ok++
    } catch (err) {
      console.log(` ✗ ${err.message}`)
      fail++
    }
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`  Subidos:  ${ok}`)
  console.log(`  Fallidos: ${fail}`)
  console.log(`─────────────────────────────────\n`)

  if (fail > 0) process.exit(1)
}

main().catch(err => {
  console.error('\n✗ Error fatal:', err.message)
  process.exit(1)
})
