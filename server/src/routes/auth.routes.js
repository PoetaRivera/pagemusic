import { Router } from 'express'
import { login, verifyToken } from '../controllers/auth.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'
import { loginSchema } from '../schemas/auth.schema.js'

const router = Router()

router.post('/login', validate(loginSchema), login)
router.get('/verify', requireAdmin, verifyToken)

export default router
