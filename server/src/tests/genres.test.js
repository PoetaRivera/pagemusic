import request from 'supertest'
import app from '../app.js'
import { resetDB, getAdminToken, seedGenre } from './helpers.js'

let token

beforeAll(() => {
  resetDB()
  token = getAdminToken()
})

describe('GET /api/genres', () => {
  test('retorna lista de géneros', async () => {
    seedGenre('Jazz')
    const res = await request(app).get('/api/genres')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})

describe('GET /api/genres/:id', () => {
  test('retorna el género por id', async () => {
    const genre = seedGenre('Blues')
    const res = await request(app).get(`/api/genres/${genre.id}`)

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Blues')
  })

  test('retorna 404 si no existe', async () => {
    const res = await request(app).get('/api/genres/99999')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Género no encontrado')
  })
})

describe('POST /api/genres', () => {
  test('crea un género con datos válidos', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pop', description: 'Música popular' })

    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Pop')
    expect(res.body).toHaveProperty('id')
  })

  test('rechaza nombre duplicado', async () => {
    seedGenre('Duplicado')
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Duplicado' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Ya existe un género con ese nombre')
  })

  test('rechaza sin autenticación', async () => {
    const res = await request(app)
      .post('/api/genres')
      .send({ name: 'Sin auth' })

    expect(res.status).toBe(401)
  })

  test('rechaza body vacío (validación zod)', async () => {
    const res = await request(app)
      .post('/api/genres')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(res.status).toBe(400)
  })
})

describe('PUT /api/genres/:id', () => {
  test('actualiza un género existente', async () => {
    const genre = seedGenre('OldName')
    const res = await request(app)
      .put(`/api/genres/${genre.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'NewName' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('NewName')
  })

  test('retorna 404 si no existe', async () => {
    const res = await request(app)
      .put('/api/genres/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'X' })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/genres/:id', () => {
  test('elimina un género sin canciones', async () => {
    const genre = seedGenre('ToDelete')
    const res = await request(app)
      .delete(`/api/genres/${genre.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Género eliminado')
  })

  test('retorna 404 si no existe', async () => {
    const res = await request(app)
      .delete('/api/genres/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})
