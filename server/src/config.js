import 'dotenv/config'

export const PORT = process.env.PORT || 4000
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_inseguro'
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234'
