import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { requireAdmin } from '../middlewares/auth.middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

const VALID_GENRES = ['bachata','balada','bolero','bossanova','declamado','otros','pop','rock','salsa','soul','tango','trova']

const sanitizeGenre = (raw) => VALID_GENRES.includes(raw) ? raw : 'otros'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const genre = sanitizeGenre(req.query.genre)
    const genreDir = path.join(UPLOADS_DIR, genre)
    import('fs').then(({ mkdirSync }) => {
      mkdirSync(genreDir, { recursive: true })
      cb(null, genreDir)
    })
  },
  filename: (req, file, cb) => {
    // Preservar nombre original, reemplazar espacios con guiones
    const clean = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, clean)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB máximo
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'audio/mpeg' || file.originalname.toLowerCase().endsWith('.mp3')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos MP3'))
    }
  }
})

const router = Router()

router.post('/', requireAdmin, upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo' })

  const genre = sanitizeGenre(req.query.genre)
  const filename = req.file.filename
  const protocol = req.protocol
  const host = req.get('host')
  const url = `${protocol}://${host}/uploads/${genre}/${encodeURIComponent(filename)}`

  res.json({ url, filename, genre })
})

export default router
