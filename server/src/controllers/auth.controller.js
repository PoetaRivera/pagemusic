import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { JWT_SECRET } from '../config.js'

export const login = (req, res) => {
  const { username, password } = req.body

  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username)
  if (!admin) {
    return res.status(400).json({ message: 'Credenciales incorrectas' })
  }

  const valid = bcrypt.compareSync(password, admin.password_hash)
  if (!valid) {
    return res.status(400).json({ message: 'Credenciales incorrectas' })
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({ token, username: admin.username })
}

export const verifyToken = (req, res) => {
  res.json({ valid: true, username: req.admin.username })
}
