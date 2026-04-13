import request from 'supertest'
import app from '../app.js'
import { resetDB, getAdminToken } from './helpers.js'

beforeAll(resetDB)

describe('POST /api/admin/login', () => {
  test('devuelve token con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'admin1234' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.username).toBe('admin')
  })

  test('rechaza contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrongpassword' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  test('rechaza usuario inexistente', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'noexiste', password: 'admin1234' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  test('rechaza body vacío (validación zod)', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({})

    expect(res.status).toBe(400)
  })
})

describe('GET /api/admin/verify', () => {
  test('retorna válido con token correcto', async () => {
    const token = getAdminToken()
    const res = await request(app)
      .get('/api/admin/verify')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.valid).toBe(true)
    expect(res.body.username).toBe('admin')
  })

  test('rechaza sin token', async () => {
    const res = await request(app).get('/api/admin/verify')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token requerido')
  })

  test('rechaza token inválido', async () => {
    const res = await request(app)
      .get('/api/admin/verify')
      .set('Authorization', 'Bearer token_falso')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token inválido o expirado')
  })
})
