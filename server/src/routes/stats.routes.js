import { Router } from 'express'
import { recordPlay, topSongs, topGenres, byHour, byWeekday, mostSkipped, summary } from '../controllers/stats.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

// Público: registrar reproducción
router.post('/plays', recordPlay)

// Solo admin: consultar estadísticas
router.get('/summary', requireAdmin, summary)
router.get('/top-songs', requireAdmin, topSongs)
router.get('/top-genres', requireAdmin, topGenres)
router.get('/by-hour', requireAdmin, byHour)
router.get('/by-weekday', requireAdmin, byWeekday)
router.get('/most-skipped', requireAdmin, mostSkipped)

export default router
