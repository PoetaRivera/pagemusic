import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function seedIfEmpty(db) {
  const existingGenres = db.prepare('SELECT COUNT(*) as count FROM genres').get()
  if (existingGenres.count > 0) {
    console.log('Database already seeded, skipping.')
    return
  }

  console.log('Seeding database...')

  const insertGenre = db.prepare('INSERT INTO genres (name, description) VALUES (?, ?)')
  const insertSong = db.prepare('INSERT INTO songs (title, artist, duration, audio_url, cover_url, genre_id) VALUES (?, ?, ?, ?, ?, ?)')
  const getGenreId = db.prepare('SELECT id FROM genres WHERE name = ?')

const genres = [
  { name: "Pop Rock", description: "Mezcla de pop y rock" },
  { name: "salsa", description: null },
  { name: "bachata", description: "Ritmo romántico dominico" },
  { name: "tango", description: "Ritmo argentino melancólico" },
  { name: "rock", description: "Música rock y derivadas" },
  { name: "balada", description: "Baladas y baladas pop" },
  { name: "trova", description: "Trova y música trovadoresca" },
  { name: "bolero", description: "Bolero y música romántica" },
  { name: "pop", description: "Música pop y popular" },
  { name: "otros", description: "Otros estilos musicales" },
  { name: "declamado", description: "Poemas declamados" },
]

  for (const g of genres) {
    insertGenre.run(g.name, g.description)
  }

const songs = [
  { title: "Amé-bachata", artist: "PoetaRivera", duration: 148, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/Am%C3%A9-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "Asoma el invierno-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/Asoma%20el%20invierno-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "Distancia-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/Distancia-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "Si has elegido-bachata", artist: "PoetaRivera", duration: 176, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/Si%20has%20elegido-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "el viaje-bachata-dueto ", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/el%20viaje-bachata-dueto%20.mp3", cover_url: null, genre: "bachata" },
  { title: "ellos-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/ellos-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "fuiste mia-bachata", artist: "PoetaRivera", duration: 163, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/fuiste%20mia-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "lazos invisibles-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/lazos%20invisibles-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "no te rindas-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/no%20te%20rindas-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "subito suplo-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/subito%20suplo-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "y desde entonces-bachata", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bachata/y%20desde%20entonces-bachata.mp3", cover_url: null, genre: "bachata" },
  { title: "Distancia-balada-pop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/Distancia-balada-pop.mp3", cover_url: null, genre: "balada" },
  { title: "Hoy quería escribirle-balada-rock,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/Hoy%20quer%C3%ADa%20escribirle-balada-rock%2C.mp3", cover_url: null, genre: "balada" },
  { title: "No la toque nunca-baladapop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/No%20la%20toque%20nunca-baladapop.mp3", cover_url: null, genre: "balada" },
  { title: "Un día fui-popBalada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Un%20d%C3%ADa%20fui-popBalada.mp3", cover_url: null, genre: "balada" },
  { title: "cuando-balada-ranchera-mujer", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/cuando-balada-ranchera-mujer.mp3", cover_url: null, genre: "balada" },
  { title: "cuando-balada2", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/cuando-balada2.mp3", cover_url: null, genre: "balada" },
  { title: "eres-balada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/eres-balada.mp3", cover_url: null, genre: "balada" },
  { title: "eres-balada2", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/eres-balada2.mp3", cover_url: null, genre: "balada" },
  { title: "quisiera ser un gran poeta-balada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/quisiera%20ser%20un%20gran%20poeta-balada.mp3", cover_url: null, genre: "balada" },
  { title: "quizá te olvide un día-balada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/quiz%C3%A1%20te%20olvide%20un%20d%C3%ADa-balada.mp3", cover_url: null, genre: "balada" },
  { title: "somos-balada-poetica", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/somos-balada-poetica.mp3", cover_url: null, genre: "balada" },
  { title: "su sonrisa-balada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/su%20sonrisa-balada.mp3", cover_url: null, genre: "balada" },
  { title: "un dia fui-popBalad2", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/un%20dia%20fui-popBalad2.mp3", cover_url: null, genre: "balada" },
  { title: "volviendo a soña-balada-pop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/balada/volviendo%20a%20so%C3%B1a-balada-pop.mp3", cover_url: null, genre: "balada" },
  { title: "Ese día-bolero", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Ese%20d%C3%ADa-bolero.mp3", cover_url: null, genre: "bolero" },
  { title: "Hoy quería escribirle-bolero-moderno,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/Hoy%20quer%C3%ADa%20escribirle-bolero-moderno%2C.mp3", cover_url: null, genre: "bolero" },
  { title: "Súbito soplo-bolero-jass2", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/S%C3%BAbito%20soplo-bolero-jass2.mp3", cover_url: null, genre: "bolero" },
  { title: "Súbito soplo-bolero-jazzl,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/S%C3%BAbito%20soplo-bolero-jazzl%2C.mp3", cover_url: null, genre: "bolero" },
  { title: "en mi ventana-bolero-jazz", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/en%20mi%20ventana-bolero-jazz.mp3", cover_url: null, genre: "bolero" },
  { title: "eres-bosanova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/eres-bosanova.mp3", cover_url: null, genre: "bolero" },
  { title: "si duerme usted primero-bolero-balada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/si%20duerme%20usted%20primero-bolero-balada.mp3", cover_url: null, genre: "bolero" },
  { title: "subito soplo-bolero", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/bolero/subito%20soplo-bolero.mp3", cover_url: null, genre: "bolero" },
  { title: "(Arpegio de guitarra acústica cálido y u", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/(Arpegio%20de%20guitarra%20ac%C3%BAstica%20c%C3%A1lido%20y%20u.mp3", cover_url: null, genre: "otros" },
  { title: "Amor es (Edit)", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Amor%20es%20(Edit).mp3", cover_url: null, genre: "otros" },
  { title: "Amor es…", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Amor%20es%E2%80%A6.mp3", cover_url: null, genre: "otros" },
  { title: "Amor secreto…", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Amor%20secreto%E2%80%A6.mp3", cover_url: null, genre: "otros" },
  { title: "Amándose I", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Am%C3%A1ndose%20I.mp3", cover_url: null, genre: "otros" },
  { title: "Amándose-rock suave I", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Am%C3%A1ndose-rock%20suave%20I.mp3", cover_url: null, genre: "otros" },
  { title: "Amé-rock1", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Am%C3%A9-rock1.mp3", cover_url: null, genre: "otros" },
  { title: "Cuando", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Cuando.mp3", cover_url: null, genre: "otros" },
  { title: "Ella lleva un hijo,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Ella%20lleva%20un%20hijo%2C.mp3", cover_url: null, genre: "otros" },
  { title: "En una tierra encantada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/En%20una%20tierra%20encantada.mp3", cover_url: null, genre: "otros" },
  { title: "Hay amores…", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Hay%20amores%E2%80%A6.mp3", cover_url: null, genre: "otros" },
  { title: "Hay palabras… ", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Hay%20palabras%E2%80%A6%20.mp3", cover_url: null, genre: "otros" },
  { title: "Hoy quería escribirle-rock balada,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Hoy%20quer%C3%ADa%20escribirle-rock%20balada%2C.mp3", cover_url: null, genre: "otros" },
  { title: "La Espera", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/La%20Espera.mp3", cover_url: null, genre: "otros" },
  { title: "No hay nada perdido,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/No%20hay%20nada%20perdido%2C.mp3", cover_url: null, genre: "otros" },
  { title: "No hay nada perdido- soulful-gaspel,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/No%20hay%20nada%20perdido-%20soulful-gaspel%2C.mp3", cover_url: null, genre: "otros" },
  { title: "No la toque nunca-poprockbalada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/No%20la%20toque%20nunca-poprockbalada.mp3", cover_url: null, genre: "otros" },
  { title: "Olvido y Polvo", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Olvido%20y%20Polvo.mp3", cover_url: null, genre: "otros" },
  { title: "Se durmió entre mis manos,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Se%20durmi%C3%B3%20entre%20mis%20manos%2C.mp3", cover_url: null, genre: "otros" },
  { title: "Se fue ", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Se%20fue%20.mp3", cover_url: null, genre: "otros" },
  { title: "Usted y YO", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/Usted%20y%20YO.mp3", cover_url: null, genre: "otros" },
  { title: "Usted y YO", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Usted%20y%20YO.mp3", cover_url: null, genre: "otros" },
  { title: "al maestro", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/al%20maestro.mp3", cover_url: null, genre: "otros" },
  { title: "asoma", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/asoma.mp3", cover_url: null, genre: "otros" },
  { title: "asoma la muerte", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/asoma%20la%20muerte.mp3", cover_url: null, genre: "otros" },
  { title: "añoranza", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/a%C3%B1oranza.mp3", cover_url: null, genre: "otros" },
  { title: "con la mirada1", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/con%20la%20mirada1.mp3", cover_url: null, genre: "otros" },
  { title: "con la mirada2", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/con%20la%20mirada2.mp3", cover_url: null, genre: "otros" },
  { title: "corazon de torogoz", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/corazon%20de%20torogoz.mp3", cover_url: null, genre: "otros" },
  { title: "cuando- balada1", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/cuando-%20balada1.mp3", cover_url: null, genre: "otros" },
  { title: "hasta pronto", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/hasta%20pronto.mp3", cover_url: null, genre: "otros" },
  { title: "he de olvidarte-trip-hop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/he%20de%20olvidarte-trip-hop.mp3", cover_url: null, genre: "otros" },
  { title: "juventud y vejez", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/juventud%20y%20vejez.mp3", cover_url: null, genre: "otros" },
  { title: "juventud y vejez2", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/juventud%20y%20vejez2.mp3", cover_url: null, genre: "otros" },
  { title: "lluvia y lagrimas-reggue-pop ", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/lluvia%20y%20lagrimas-reggue-pop%20.mp3", cover_url: null, genre: "otros" },
  { title: "lluvia y lagrimas-samba-pop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/lluvia%20y%20lagrimas-samba-pop.mp3", cover_url: null, genre: "otros" },
  { title: "mi vaquera-country-pop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/mi%20vaquera-country-pop.mp3", cover_url: null, genre: "otros" },
  { title: "mi vaquera-norteño-romantico", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/mi%20vaquera-norte%C3%B1o-romantico.mp3", cover_url: null, genre: "otros" },
  { title: "no te rindas-soul", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/no%20te%20rindas-soul.mp3", cover_url: null, genre: "otros" },
  { title: "olvido-gipsy-jazz", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/olvido-gipsy-jazz.mp3", cover_url: null, genre: "otros" },
  { title: "para mi hermanita", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/para%20mi%20hermanita.mp3", cover_url: null, genre: "otros" },
  { title: "quizá te olvide un día-zamba-argentina", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/quiz%C3%A1%20te%20olvide%20un%20d%C3%ADa-zamba-argentina.mp3", cover_url: null, genre: "otros" },
  { title: "reclamo de un infante", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/reclamo%20de%20un%20infante.mp3", cover_url: null, genre: "otros" },
  { title: "si duerme usted primero", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/si%20duerme%20usted%20primero.mp3", cover_url: null, genre: "otros" },
  { title: "sueños truncados", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/sue%C3%B1os%20truncados.mp3", cover_url: null, genre: "otros" },
  { title: "tornado", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/tornado.mp3", cover_url: null, genre: "otros" },
  { title: "un amor que nunca llego-dramatico-bolero", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/un%20amor%20que%20nunca%20llego-dramatico-bolero.mp3", cover_url: null, genre: "otros" },
  { title: "y desde entonces", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/y%20desde%20entonces.mp3", cover_url: null, genre: "otros" },
  { title: "¡Y la amé tanto…!", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/%C2%A1Y%20la%20am%C3%A9%20tanto%E2%80%A6!.mp3", cover_url: null, genre: "otros" },
  { title: "¿QUÉ ME HAS DEJADO DE AMAR-rumba-flamenca", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/otros/%C2%BFQU%C3%89%20ME%20HAS%20DEJADO%20DE%20AMAR-rumba-flamenca.mp3", cover_url: null, genre: "otros" },
  { title: "Momentos de infancia-popBarroco", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Momentos%20de%20infancia-popBarroco.mp3", cover_url: null, genre: "pop" },
  { title: "No la toque nunca-poprock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/pop/No%20la%20toque%20nunca-poprock.mp3", cover_url: null, genre: "pop" },
  { title: "el amor-poprock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/pop/el%20amor-poprock.mp3", cover_url: null, genre: "pop" },
  { title: "el viaje-pop-dueto ", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/pop/el%20viaje-pop-dueto%20.mp3", cover_url: null, genre: "pop" },
  { title: "he de olvidarte-latin-pop-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/pop/he%20de%20olvidarte-latin-pop-rock.mp3", cover_url: null, genre: "pop" },
  { title: "lejania-pop-latino", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/pop/lejania-pop-latino.mp3", cover_url: null, genre: "pop" },
  { title: "te extraño-latin-pop-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/pop/te%20extra%C3%B1o-latin-pop-rock.mp3", cover_url: null, genre: "pop" },
  { title: "Amé-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/Am%C3%A9-rock.mp3", cover_url: null, genre: "rock" },
  { title: "Asoma el invierno-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/Asoma%20el%20invierno-rock.mp3", cover_url: null, genre: "rock" },
  { title: "Eran los años postreros-soul-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/Eran%20los%20a%C3%B1os%20postreros-soul-rock.mp3", cover_url: null, genre: "rock" },
  { title: "Ese dia-soulRock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Ese%20dia-soulRock.mp3", cover_url: null, genre: "rock" },
  { title: "Ese día-popRockBallad", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Ese%20d%C3%ADa-popRockBallad.mp3", cover_url: null, genre: "rock" },
  { title: "Hay palabras-soul-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/Hay%20palabras-soul-rock.mp3", cover_url: null, genre: "rock" },
  { title: "La felicidad-softRock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/La%20felicidad-softRock.mp3", cover_url: null, genre: "rock" },
  { title: "Si has elegido-pop-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/Si%20has%20elegido-pop-rock.mp3", cover_url: null, genre: "rock" },
  { title: "Sueños deshojados-soft-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/Sue%C3%B1os%20deshojados-soft-rock.mp3", cover_url: null, genre: "rock" },
  { title: "aqui yo la espero-pop-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/aqui%20yo%20la%20espero-pop-rock.mp3", cover_url: null, genre: "rock" },
  { title: "ausencia-pop-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/ausencia-pop-rock.mp3", cover_url: null, genre: "rock" },
  { title: "centro america anhelada-soul-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/centro%20america%20anhelada-soul-rock.mp3", cover_url: null, genre: "rock" },
  { title: "el amor-popRockBalada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/el%20amor-popRockBalada.mp3", cover_url: null, genre: "rock" },
  { title: "fuisre mia-soft-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/fuisre%20mia-soft-rock.mp3", cover_url: null, genre: "rock" },
  { title: "he de olvidarte-pop-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/he%20de%20olvidarte-pop-rock.mp3", cover_url: null, genre: "rock" },
  { title: "reclamo de un infante-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/reclamo%20de%20un%20infante-rock.mp3", cover_url: null, genre: "rock" },
  { title: "sueños truncados-soul-rock, ", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/sue%C3%B1os%20truncados-soul-rock%2C%20.mp3", cover_url: null, genre: "rock" },
  { title: "tornado-blues-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/tornado-blues-rock.mp3", cover_url: null, genre: "rock" },
  { title: "tornado-soul-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/rock/tornado-soul-rock.mp3", cover_url: null, genre: "rock" },
  { title: "No la toque nunca.-salsa", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/No%20la%20toque%20nunca.-salsa.mp3", cover_url: null, genre: "salsa" },
  { title: "Sueños deshojados-salsa", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/Sue%C3%B1os%20deshojados-salsa.mp3", cover_url: null, genre: "salsa" },
  { title: "anhelos-salsa-merengue", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/anhelos-salsa-merengue.mp3", cover_url: null, genre: "salsa" },
  { title: "el amor-salsa", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/el%20amor-salsa.mp3", cover_url: null, genre: "salsa" },
  { title: "el parque-salsa", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/el%20parque-salsa.mp3", cover_url: null, genre: "salsa" },
  { title: "fuiste mia-salsa", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/fuiste%20mia-salsa.mp3", cover_url: null, genre: "salsa" },
  { title: "¿QUÉ ME HAS DEJADO DE AMAR-salsa_", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/salsa/%C2%BFQU%C3%89%20ME%20HAS%20DEJADO%20DE%20AMAR-salsa_.mp3", cover_url: null, genre: "salsa" },
  { title: "Asoma el invierno-tango", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/Asoma%20el%20invierno-tango.mp3", cover_url: null, genre: "tango" },
  { title: "Ellos-tango-fusion", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/Ellos-tango-fusion.mp3", cover_url: null, genre: "tango" },
  { title: "Súbito soplo-tango-fusion,", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/S%C3%BAbito%20soplo-tango-fusion%2C.mp3", cover_url: null, genre: "tango" },
  { title: "el parque-tango", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/el%20parque-tango.mp3", cover_url: null, genre: "tango" },
  { title: "ellos-tango-rock", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/ellos-tango-rock.mp3", cover_url: null, genre: "tango" },
  { title: "niño de la calle-tango", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/ni%C3%B1o%20de%20la%20calle-tango.mp3", cover_url: null, genre: "tango" },
  { title: "olvido-tango-blues", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/olvido-tango-blues.mp3", cover_url: null, genre: "tango" },
  { title: "somos-tango", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/somos-tango.mp3", cover_url: null, genre: "tango" },
  { title: "subito sopolo-tango", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/tango/subito%20sopolo-tango.mp3", cover_url: null, genre: "tango" },
  { title: "Amé-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/Am%C3%A9-trova.mp3", cover_url: null, genre: "trova" },
  { title: "Ese día-latinAmericanTrova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/Ese%20d%C3%ADa-latinAmericanTrova.mp3", cover_url: null, genre: "trova" },
  { title: "No la toque nunca-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/No%20la%20toque%20nunca-trova.mp3", cover_url: null, genre: "trova" },
  { title: "anhelos-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/anhelos-trova.mp3", cover_url: null, genre: "trova" },
  { title: "el amor-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/el%20amor-trova.mp3", cover_url: null, genre: "trova" },
  { title: "en mi ventana-trova-pop", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/en%20mi%20ventana-trova-pop.mp3", cover_url: null, genre: "trova" },
  { title: "fuiste mia-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/fuiste%20mia-trova.mp3", cover_url: null, genre: "trova" },
  { title: "he de olvidarte-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/he%20de%20olvidarte-trova.mp3", cover_url: null, genre: "trova" },
  { title: "lejania-trova-son", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/lejania-trova-son.mp3", cover_url: null, genre: "trova" },
  { title: "su sonrisa-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/su%20sonrisa-trova.mp3", cover_url: null, genre: "trova" },
  { title: "sueños  deshijados-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/sue%C3%B1os%20%20deshijados-trova.mp3", cover_url: null, genre: "trova" },
  { title: "tornado-trova", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/trova/tornado-trova.mp3", cover_url: null, genre: "trova" },
  // Poemas declamados
  { title: "Al maestro", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Al%20maestro-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Amé", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Am%C3%A9-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Amor es", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Amor%20es-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Amor secreto", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Amor%20secreto-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Anhelos", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Anhelos-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Añoranza", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/A%C3%B1oranza-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Centro América Anhelada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Centro%20America%20Anhelada-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Como saber si la amas", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/como%20saber%20si%20la%20amas-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Con la mirada", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Con%20la%20mirada-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Corazón de torogoz", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Corazon%20de%20torogoz-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Distancia", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Distancia-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "El arribo", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/El%20arribo-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "El placer de matar", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/El%20placer%20de%20matar-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Ella ella lleva un hijo", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Ella%20ella%20lleva%20un%20hijo-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Ella", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Ella-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Ese día", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Ese%20dia-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Hasta pronto Mauricio", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Hasta%20pronto%20mauricio-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Hasta pronto", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Hasta%20pronto-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Hay amores", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Hay%20amores-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Hay palabras", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Hay%20palabras-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Hijo de la desidia", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Hijo%20de%20la%20descidia-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Juventud y vejez", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Juventud%20y%20Vejez-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "La espera", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/La%20Espera-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Lazos invisibles", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Lazos%20invisibles-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Los años postreros", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Los%20a%C3%B1os%20postreros-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "No hay nada perdido", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/No%20hay%20nada%20perdido-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Para mi hermanita", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Para%20mi%20hermanita-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Quizá", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Quiza-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Reclamo de un infante", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Reclamo%20de%20un%20infante-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Río Bravo", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/R%C3%ADo%20Bravo-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Se fue y", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Se%20fue%20y-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Se fue", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Se%20fue-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Suchitlán", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Suchitl%C3%A1n-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
  { title: "Un amor que nunca llegó", artist: "PoetaRivera", duration: null, audio_url: "https://media.githubusercontent.com/media/PoetaRivera/pagemusic-storage/main/declamado/Un%20amor%20que%20nunca%20llego-ryp-declamado.mp3", cover_url: null, genre: "declamado" },
]

  for (const s of songs) {
    const genre = getGenreId.get(s.genre)
    if (!genre) { console.warn('Genre not found:', s.genre); continue }
    insertSong.run(s.title, s.artist, s.duration, s.audio_url, s.cover_url, genre.id)
  }

  console.log(`Seeded ${genres.length} genres and ${songs.length} songs.`)
}

// Permite correr el script standalone: node src/seed.js
if (process.argv[1] === __filename) {
  const standaloneDb = new Database(path.join(__dirname, '../database/pagemusic.db'))
  standaloneDb.pragma('foreign_keys = ON')
  seedIfEmpty(standaloneDb)
  standaloneDb.close()
}
