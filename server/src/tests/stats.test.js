import request from 'supertest'
import app from '../app.js'
import { resetDB, getAdminToken, seedGenre, seedSong } from './helpers.js'

let token
let song

beforeAll(() => {
  resetDB()
  token = getAdminToken()
  const genre = seedGenre('Stats')
  song = seedSong(genre.id, { title: 'Stats Song' })
})

describe('POST /api/stats/plays', () => {
  test('registra una reproduccion anonima con datos validos', async () => {
    const res = await request(app)
      .post('/api/stats/plays')
      .send({
        song_id: song.id,
        duration_listened: 45,
        completed: false,
        skipped: true,
      })

    expect(res.status).toBe(201)
    expect(res.body.recorded).toBe(true)
  })

  test('rechaza una reproduccion sin song_id', async () => {
    const res = await request(app)
      .post('/api/stats/plays')
      .send({ duration_listened: 10 })

    expect(res.status).toBe(400)
  })

  test('rechaza duracion escuchada fuera de rango', async () => {
    const res = await request(app)
      .post('/api/stats/plays')
      .send({ song_id: song.id, duration_listened: -1 })

    expect(res.status).toBe(400)
  })

  test('retorna 404 si la cancion no existe', async () => {
    const res = await request(app)
      .post('/api/stats/plays')
      .send({ song_id: 99999, duration_listened: 10 })

    expect(res.status).toBe(404)
  })
})

describe('GET /api/stats/summary', () => {
  test('rechaza consulta sin admin', async () => {
    const res = await request(app).get('/api/stats/summary')

    expect(res.status).toBe(401)
  })

  test('retorna resumen con admin', async () => {
    const res = await request(app)
      .get('/api/stats/summary')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('total_plays')
  })
})
