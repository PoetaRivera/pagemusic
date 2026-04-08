import { Router } from 'express'
import { getAll, search, create, update, remove, patchDuration } from '../controllers/songs.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'
import { songSchema } from '../schemas/song.schema.js'

const router = Router()

router.get('/', getAll)
router.get('/search', search)
router.post('/', requireAdmin, validate(songSchema), create)
router.put('/:id', requireAdmin, validate(songSchema), update)
router.patch('/:id/duration', patchDuration)
router.delete('/:id', requireAdmin, remove)

export default router
