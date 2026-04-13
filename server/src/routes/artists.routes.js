import { Router } from 'express'
import { getAll, getByName } from '../controllers/artists.controller.js'

const router = Router()

router.get('/', getAll)
router.get('/:name/songs', getByName)

export default router
