import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { FRONTEND_URL } from './config.js'
import authRoutes from './routes/auth.routes.js'
import genresRoutes from './routes/genres.routes.js'
import songsRoutes from './routes/songs.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import statsRoutes from './routes/stats.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())
app.use(morgan('dev'))

// Servir archivos subidos desde el admin
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

app.use('/api/admin', authRoutes)
app.use('/api/admin/upload', uploadRoutes)
app.use('/api/genres', genresRoutes)
app.use('/api/songs', songsRoutes)
app.use('/api/stats', statsRoutes)

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const distPath = path.join(__dirname, '../../client/dist')
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})

export default app
