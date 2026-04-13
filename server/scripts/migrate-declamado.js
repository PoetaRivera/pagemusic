/**
 * Script: migrate-declamado.js
 * Agrega el género "declamado" y sus 34 poemas a una BD que ya tiene datos.
 *
 * Uso:
 *   node scripts/migrate-declamado.js                        (producción)
 *   node scripts/migrate-declamado.js --local                (localhost:4000)
 *   node scripts/migrate-declamado.js --user X --pass Y
 */

const SONGS = [
  { title: "Al maestro", file: "Al%20maestro-ryp-declamado.mp3" },
  { title: "Amé", file: "Am%C3%A9-ryp-declamado.mp3" },
  { title: "Amor es", file: "Amor%20es-ryp-declamado.mp3" },
  { title: "Amor secreto", file: "Amor%20secreto-ryp-declamado.mp3" },
  { title: "Anhelos", file: "Anhelos-ryp-declamado.mp3" },
  { title: "Añoranza", file: "A%C3%B1oranza-ryp-declamado.mp3" },
  { title: "Centro América Anhelada", file: "Centro%20America%20Anhelada-ryp-declamado.mp3" },
  { title: "Como saber si la amas", file: "como%20saber%20si%20la%20amas-ryp-declamado.mp3" },
  { title: "Con la mirada", file: "Con%20la%20mirada-ryp-declamado.mp3" },
  { title: "Corazón de torogoz", file: "Corazon%20de%20torogoz-ryp-declamado.mp3" },
  { title: "Distancia", file: "Distancia-ryp-declamado.mp3" },
  { title: "El arribo", file: "El%20arribo-ryp-declamado.mp3" },
  { title: "El placer de matar", file: "El%20placer%20de%20matar-ryp-declamado.mp3" },
  { title: "Ella ella lleva un hijo", file: "Ella%20ella%20lleva%20un%20hijo-ryp-declamado.mp3" },
  { title: "Ella", file: "Ella-ryp-declamado.mp3" },
  { title: "Ese día", file: "Ese%20dia-ryp-declamado.mp3" },
  { title: "Hasta pronto Mauricio", file: "Hasta%20pronto%20mauricio-ryp-declamado.mp3" },
  { title: "Hasta pronto", file: "Hasta%20pronto-ryp-declamado.mp3" },
  { title: "Hay amores", file: "Hay%20amores-ryp-declamado.mp3" },
  { title: "Hay palabras", file: "Hay%20palabras-ryp-declamado.mp3" },
  { title: "Hijo de la desidia", file: "Hijo%20de%20la%20descidia-ryp-declamado.mp3" },
  { title: "Juventud y vejez", file: "Juventud%20y%20Vejez-ryp-declamado.mp3" },
  { title: "La espera", file: "La%20Espera-ryp-declamado.mp3" },
  { title: "Lazos invisibles", file: "Lazos%20invisibles-ryp-declamado.mp3" },
  { title: "Los años postreros", file: "Los%20a%C3%B1os%20postreros-ryp-declamado.mp3" },
  { title: "No hay nada perdido", file: "No%20hay%20nada%20perdido-ryp-declamado.mp3" },
  { title: "Para mi hermanita", file: "Para%20mi%20hermanita-ryp-declamado.mp3" },
  { title: "Quizá", file: "Quiza-ryp-declamado.mp3" },
  { title: "Reclamo de un infante", file: "Reclamo%20de%20un%20infante-ryp-declamado.mp3" },
  { title: "Río Bravo", file: "R%C3%ADo%20Bravo-ryp-declamado.mp3" },
  { title: "Se fue y", file: "Se%20fue%20y-ryp-declamado.mp3" },
  { title: "Se fue", file: "Se%20fue-ryp-declamado.mp3" },
  { title: "Suchitlán", file: "Suchitl%C3%A1n-ryp-declamado.mp3" },
  { title: "Un amor que nunca llegó", file: "Un%20amor%20que%20nunca%20llego-ryp-declamado.mp3" },
]

const BASE_AUDIO = "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado"
const ARTIST = "PoetaRivera"
const GENRE_NAME = "declamado"

const args = process.argv.slice(2)
let BASE_URL = 'https://pagemusic-production.up.railway.app'
if (args.includes('--local')) BASE_URL = 'http://localhost:4000'
const urlFlag = args.indexOf('--url')
if (urlFlag !== -1 && args[urlFlag + 1]) BASE_URL = args[urlFlag + 1]
const userFlag = args.indexOf('--user')
const passFlag = args.indexOf('--pass')
const ADMIN_USER = (userFlag !== -1 && args[userFlag + 1]) ? args[userFlag + 1] : (process.env.ADMIN_USERNAME || 'admin')
const ADMIN_PASS = (passFlag !== -1 && args[passFlag + 1]) ? args[passFlag + 1] : (process.env.ADMIN_PASSWORD || 'admin1234')

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
  return (await res.json()).token
}

async function getOrCreateGenre(token) {
  const res = await fetch(`${BASE_URL}/api/genres`)
  const genres = await res.json()
  const existing = genres.find(g => g.name.toLowerCase() === GENRE_NAME)
  if (existing) {
    console.log(`✓ Género "${GENRE_NAME}" ya existe (id: ${existing.id})`)
    return existing
  }
  const create = await fetch(`${BASE_URL}/api/genres`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: GENRE_NAME, description: 'Poemas declamados' }),
  })
  if (!create.ok) throw new Error(`No se pudo crear el género: ${create.status}`)
  const genre = await create.json()
  console.log(`✓ Género "${GENRE_NAME}" creado (id: ${genre.id})`)
  return genre
}

async function createSong(token, title, audioUrl, genreId) {
  const res = await fetch(`${BASE_URL}/api/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, artist: ARTIST, audio_url: audioUrl, genre_id: genreId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || res.status)
  }
  return res.json()
}

async function main() {
  console.log(`\n🎙 Migrando poemas declamados → ${BASE_URL}\n`)

  const token = await login()
  console.log('✓ Sesión iniciada\n')

  const genre = await getOrCreateGenre(token)
  console.log()

  // Verificar cuáles ya existen
  const existing = await fetch(`${BASE_URL}/api/genres/${genre.id}/songs`)
  const { songs: existingSongs } = await existing.json()
  const existingTitles = new Set(existingSongs.map(s => s.title.toLowerCase()))

  let ok = 0, skip = 0, fail = 0

  for (const { title, file } of SONGS) {
    if (existingTitles.has(title.toLowerCase())) {
      console.log(`  omitido (ya existe): ${title}`)
      skip++
      continue
    }
    const audioUrl = `${BASE_AUDIO}/${file}`
    process.stdout.write(`  Agregando: ${title}...`)
    try {
      await createSong(token, title, audioUrl, genre.id)
      console.log(' ✓')
      ok++
    } catch (err) {
      console.log(` ✗ ${err.message}`)
      fail++
    }
  }

  console.log(`\n──────────────────────────────────`)
  console.log(`  Agregados: ${ok}`)
  console.log(`  Omitidos:  ${skip}`)
  console.log(`  Fallidos:  ${fail}`)
  console.log(`──────────────────────────────────\n`)

  if (fail > 0) process.exit(1)
}

main().catch(err => {
  console.error('\n✗ Error:', err.message)
  process.exit(1)
})
