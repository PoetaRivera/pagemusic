import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, verifyToken } from '../controllers/auth.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'
import { loginSchema } from '../schemas/auth.schema.js'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // máximo 10 intentos por IP
  message: { message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = Router()

router.post('/login', loginLimiter, validate(loginSchema), login)
router.get('/verify', requireAdmin, verifyToken)

export default router
