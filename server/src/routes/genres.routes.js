import { Router } from 'express'
import { getAll, getById, create, update, remove } from '../controllers/genres.controller.js'
import { getByGenre } from '../controllers/songs.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'
import { genreSchema } from '../schemas/genre.schema.js'

const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.get('/:id/songs', getByGenre)
router.post('/', requireAdmin, validate(genreSchema), create)
router.put('/:id', requireAdmin, validate(genreSchema), update)
router.delete('/:id', requireAdmin, remove)

export default router
