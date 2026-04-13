import request from 'supertest'
import app from '../app.js'
import { resetDB, getAdminToken, seedGenre, seedSong } from './helpers.js'

let token
let genre

beforeAll(() => {
  resetDB()
  token = getAdminToken()
  genre = seedGenre('Rock')
})

describe('GET /api/songs', () => {
  test('retorna lista de canciones', async () => {
    seedSong(genre.id, { title: 'Song A' })
    const res = await request(app).get('/api/songs')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toHaveProperty('genre_name')
  })
})

describe('GET /api/songs/search', () => {
  beforeAll(() => {
    seedSong(genre.id, { title: 'Bohemian Rhapsody', artist: 'Queen' })
    seedSong(genre.id, { title: 'Stairway to Heaven', artist: 'Led Zeppelin' })
  })

  test('retorna canciones que coinciden con el término', async () => {
    const res = await request(app).get('/api/songs/search?q=bohemian')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].title).toBe('Bohemian Rhapsody')
  })

  test('retorna array vacío si no hay coincidencias', async () => {
    const res = await request(app).get('/api/songs/search?q=xyznotexists')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('retorna array vacío si q está vacío', async () => {
    const res = await request(app).get('/api/songs/search?q=')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('GET /api/genres/:id/songs', () => {
  test('retorna canciones del género con info del género', async () => {
    const res = await request(app).get(`/api/genres/${genre.id}/songs`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('genre')
    expect(res.body).toHaveProperty('songs')
    expect(res.body.genre.id).toBe(genre.id)
  })

  test('retorna 404 si el género no existe', async () => {
    const res = await request(app).get('/api/genres/99999/songs')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Género no encontrado')
  })
})

describe('POST /api/songs', () => {
  test('crea una canción con datos válidos', async () => {
    const res = await request(app)
      .post('/api/songs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Song',
        artist: 'New Artist',
        audio_url: 'http://example.com/new.mp3',
        genre_id: genre.id
      })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('New Song')
    expect(res.body.genre_name).toBe('Rock')
  })

  test('rechaza si el género no existe', async () => {
    const res = await request(app)
      .post('/api/songs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Song X',
        artist: 'Artist X',
        audio_url: 'http://example.com/x.mp3',
        genre_id: 99999
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('El género especificado no existe')
  })

  test('rechaza sin autenticación', async () => {
    const res = await request(app)
      .post('/api/songs')
      .send({ title: 'Song', artist: 'A', audio_url: 'http://x.com/a.mp3', genre_id: genre.id })

    expect(res.status).toBe(401)
  })
})

describe('PUT /api/songs/:id', () => {
  test('actualiza una canción existente', async () => {
    const song = seedSong(genre.id, { title: 'Before Update' })
    const res = await request(app)
      .put(`/api/songs/${song.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'After Update',
        artist: 'Artist',
        audio_url: 'http://example.com/updated.mp3',
        genre_id: genre.id
      })

    expect(res.status).toBe(200)
    expect(res.body.title).toBe('After Update')
  })

  test('retorna 404 si la canción no existe', async () => {
    const res = await request(app)
      .put('/api/songs/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'X', artist: 'X', audio_url: 'http://x.com/x.mp3', genre_id: genre.id })

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/songs/:id/duration', () => {
  test('actualiza duración si no tenía', async () => {
    const song = seedSong(genre.id, { title: 'No Duration', duration: null })
    const res = await request(app)
      .patch(`/api/songs/${song.id}/duration`)
      .send({ duration: 200 })

    expect(res.status).toBe(200)
    expect(res.body.updated).toBe(true)
  })

  test('omite actualización si ya tiene duración', async () => {
    const song = seedSong(genre.id, { title: 'Has Duration', duration: 180 })
    const res = await request(app)
      .patch(`/api/songs/${song.id}/duration`)
      .send({ duration: 200 })

    expect(res.status).toBe(200)
    expect(res.body.skipped).toBe(true)
  })

  test('rechaza duración inválida', async () => {
    const song = seedSong(genre.id, { title: 'Invalid Dur', duration: null })
    const res = await request(app)
      .patch(`/api/songs/${song.id}/duration`)
      .send({ duration: -5 })

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/songs/:id', () => {
  test('elimina una canción existente', async () => {
    const song = seedSong(genre.id, { title: 'To Delete' })
    const res = await request(app)
      .delete(`/api/songs/${song.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Canción eliminada')
  })

  test('retorna 404 si no existe', async () => {
    const res = await request(app)
      .delete('/api/songs/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})
