import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
