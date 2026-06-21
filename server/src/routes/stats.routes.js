import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { recordPlay, topSongs, topGenres, byHour, byWeekday, mostSkipped, summary } from '../controllers/stats.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'
import { playSchema } from '../schemas/stats.schema.js'

const router = Router()

const recordPlayLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Demasiadas reproducciones registradas. Intenta de nuevo en un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Público: registrar reproducción anónima
router.post('/plays', recordPlayLimiter, validate(playSchema), recordPlay)

// Solo admin: consultar estadísticas
router.get('/summary', requireAdmin, summary)
router.get('/top-songs', requireAdmin, topSongs)
router.get('/top-genres', requireAdmin, topGenres)
router.get('/by-hour', requireAdmin, byHour)
router.get('/by-weekday', requireAdmin, byWeekday)
router.get('/most-skipped', requireAdmin, mostSkipped)

export default router
