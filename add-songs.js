#!/usr/bin/env node
/**
 * add-songs.js — Agrega canciones nuevas a PageMusic
 *
 * Uso:
 *   node add-songs.js <género> [archivo.mp3]
 *
 * Ejemplos:
 *   node add-songs.js bachata "Nueva cancion.mp3"   ← agrega un archivo
 *   node add-songs.js bachata                        ← agrega todos los mp3 de esa carpeta
 *
 * Géneros válidos:
 *   bachata, balada, bolero, bossanova, declamado,
 *   otros, pop, rock, salsa, soul, tango, trova
 *
 * El script:
 *   1. Copia el/los mp3 al repo pagemusic-storage-temp
 *   2. Hace commit + push (con Git LFS automático)
 *   3. Llama la API de producción para insertar la(s) canción(es) en la DB
 */

import { execSync } from 'child_process'
import { existsSync, copyFileSync, readdirSync } from 'fs'
import { join } from 'path'
import https from 'https'
import { config } from 'dotenv'

// Cargar variables desde .env en la raíz del proyecto
config()

// ─── Configuración ───────────────────────────────────────────────────────────

const SOURCE_DIR  = process.env.MUSIC_SOURCE_DIR  || 'C:/CARPETA-RESPALDO/OneDrive/MUSICA-POEMAS/audios/mp3'
const STORAGE_DIR = process.env.STORAGE_REPO_DIR  || 'C:/CARPETA-RESPALDO/Escritorio/misproyectos/pagemusic-storage-temp'
const PROD_API    = process.env.PROD_API_URL       || 'https://pagemusic-production.up.railway.app'
const ADMIN_USER  = process.env.SCRIPT_ADMIN_USER
const ADMIN_PASS  = process.env.SCRIPT_ADMIN_PASS
const BASE_URL    = 'https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main'

if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('\nError: Configura SCRIPT_ADMIN_USER y SCRIPT_ADMIN_PASS en el archivo .env\n')
  process.exit(1)
}

const VALID_GENRES = ['bachata','balada','bolero','bossanova','declamado','otros','pop','rock','salsa','soul','tango','trova']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function apiRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (data) headers['Content-Length'] = Buffer.byteLength(data)

    const url = new URL(PROD_API + path)
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers,
    }, (res) => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, data: raw }) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

function encodeURL(genre, filename) {
  return `${BASE_URL}/${genre}/${encodeURIComponent(filename)}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const [,, genre, file] = process.argv

  // Validar género
  if (!genre || !VALID_GENRES.includes(genre)) {
    console.error(`\nUso: node add-songs.js <género> [archivo.mp3]`)
    console.error(`Géneros válidos: ${VALID_GENRES.join(', ')}\n`)
    process.exit(1)
  }

  // Determinar archivos a agregar
  const sourceGenreDir = join(SOURCE_DIR, genre)
  let files = []

  if (file) {
    const fullPath = join(sourceGenreDir, file)
    if (!existsSync(fullPath)) {
      console.error(`\nArchivo no encontrado: ${fullPath}\n`)
      process.exit(1)
    }
    files = [file]
  } else {
    if (!existsSync(sourceGenreDir)) {
      console.error(`\nCarpeta no encontrada: ${sourceGenreDir}\n`)
      process.exit(1)
    }
    files = readdirSync(sourceGenreDir).filter(f => f.toLowerCase().endsWith('.mp3'))
    if (!files.length) {
      console.error(`\nNo hay archivos mp3 en ${sourceGenreDir}\n`)
      process.exit(1)
    }
  }

  console.log(`\n📁 Género: ${genre}`)
  console.log(`🎵 Archivos a agregar: ${files.length}\n`)
  files.forEach(f => console.log(`   • ${f}`))
  console.log()

  // ── 1. Copiar al repo de storage ──────────────────────────────────────────
  console.log('1/3  Copiando al repo de storage...')
  const destDir = join(STORAGE_DIR, genre)

  for (const f of files) {
    const src  = join(SOURCE_DIR, genre, f)
    const dest = join(destDir, f)
    copyFileSync(src, dest)
  }
  console.log(`     ✓ ${files.length} archivo(s) copiado(s)\n`)

  // ── 2. Commit + push al repo de storage ───────────────────────────────────
  console.log('2/3  Subiendo a GitHub (LFS)...')
  try {
    execSync(`git -C "${STORAGE_DIR}" add ${files.map(f => `"${genre}/${f}"`).join(' ')}`, { stdio: 'pipe' })
    const msg = files.length === 1
      ? `add: ${genre}/${files[0]}`
      : `add: ${files.length} canciones en ${genre}`
    execSync(`git -C "${STORAGE_DIR}" commit -m "${msg}"`, { stdio: 'pipe' })
    execSync(`git -C "${STORAGE_DIR}" push origin main`, { stdio: 'inherit' })
    console.log('     ✓ Push exitoso\n')
  } catch (err) {
    console.error('     ✗ Error en git push:', err.message)
    process.exit(1)
  }

  // ── 3. Insertar en la DB de producción ────────────────────────────────────
  console.log('3/3  Insertando en la base de datos de producción...')

  // Login
  const loginRes = await apiRequest('POST', '/api/admin/login', { username: ADMIN_USER, password: ADMIN_PASS })
  if (loginRes.status !== 200 || !loginRes.data.token) {
    console.error('     ✗ Error de autenticación:', loginRes.data)
    process.exit(1)
  }
  const token = loginRes.data.token

  // Obtener géneros para encontrar el genre_id
  const genresRes = await apiRequest('GET', '/api/genres', null, token)
  const genreObj = genresRes.data.find(g => g.name === genre)
  if (!genreObj) {
    console.error(`     ✗ Género "${genre}" no encontrado en la DB de producción`)
    process.exit(1)
  }

  // Insertar cada canción
  let ok = 0, fail = 0
  for (const f of files) {
    const title = f.replace(/\.mp3$/i, '')
    const audio_url = encodeURL(genre, f)
    const res = await apiRequest('POST', '/api/songs', {
      title,
      artist: 'PoetaRivera',
      audio_url,
      cover_url: null,
      duration: null,
      genre_id: genreObj.id,
    }, token)

    if (res.status === 201) {
      console.log(`     ✓ ${title}`)
      ok++
    } else {
      console.log(`     ✗ ${title} — ${res.data?.message || res.status}`)
      fail++
    }
  }

  console.log(`\n✅ Listo: ${ok} canción(es) agregada(s)${fail ? `, ${fail} error(es)` : ''}\n`)
}

main().catch(err => {
  console.error('\n✗ Error inesperado:', err.message)
  process.exit(1)
})
