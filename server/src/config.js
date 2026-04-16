import 'dotenv/config'

export const PORT = process.env.PORT || 4000
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_inseguro'
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234'

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción')
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin1234') {
    throw new Error('ADMIN_PASSWORD debe configurarse con un valor seguro en producción')
  }
}
