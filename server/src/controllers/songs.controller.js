import db from '../db.js'

export const getAll = (req, res) => {
  const songs = db.prepare(`
    SELECT songs.*, genres.name AS genre_name
    FROM songs
    JOIN genres ON songs.genre_id = genres.id
    ORDER BY songs.title
  `).all()
  res.json(songs)
}

export const search = (req, res) => {
  const { q } = req.query
  if (!q || q.trim().length === 0) {
    return res.json([])
  }

  const searchTerm = q.trim().toLowerCase()

  const songs = db.prepare(`
    SELECT songs.*, genres.name AS genre_name
    FROM songs
    JOIN genres ON songs.genre_id = genres.id
    WHERE LOWER(songs.title) LIKE ? OR LOWER(songs.artist) LIKE ?
    ORDER BY songs.title
  `).all(`%${searchTerm}%`, `%${searchTerm}%`)

  res.json(songs)
}

export const getByGenre = (req, res) => {
  const genre = db.prepare('SELECT * FROM genres WHERE id = ?').get(req.params.id)
  if (!genre) return res.status(404).json({ message: 'Género no encontrado' })

  const songs = db.prepare(`
    SELECT songs.*, genres.name AS genre_name
    FROM songs
    JOIN genres ON songs.genre_id = genres.id
    WHERE songs.genre_id = ?
    ORDER BY songs.title
  `).all(req.params.id)

  res.json({ genre, songs })
}

export const create = (req, res) => {
  const { title, artist, album, duration, audio_url, cover_url, genre_id } = req.body

  const genreExists = db.prepare('SELECT id FROM genres WHERE id = ?').get(genre_id)
  if (!genreExists) return res.status(400).json({ message: 'El género especificado no existe' })

  const result = db.prepare(`
    INSERT INTO songs (title, artist, album, duration, audio_url, cover_url, genre_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, artist, album || null, duration || null, audio_url, cover_url || null, genre_id)

  const song = db.prepare(`
    SELECT songs.*, genres.name AS genre_name
    FROM songs JOIN genres ON songs.genre_id = genres.id
    WHERE songs.id = ?
  `).get(result.lastInsertRowid)

  res.status(201).json(song)
}

export const update = (req, res) => {
  const { title, artist, album, duration, audio_url, cover_url, genre_id } = req.body
  const { id } = req.params

  const exists = db.prepare('SELECT id FROM songs WHERE id = ?').get(id)
  if (!exists) return res.status(404).json({ message: 'Canción no encontrada' })

  const genreExists = db.prepare('SELECT id FROM genres WHERE id = ?').get(genre_id)
  if (!genreExists) return res.status(400).json({ message: 'El género especificado no existe' })

  db.prepare(`
    UPDATE songs
    SET title = ?, artist = ?, album = ?, duration = ?, audio_url = ?, cover_url = ?, genre_id = ?
    WHERE id = ?
  `).run(title, artist, album || null, duration || null, audio_url, cover_url || null, genre_id, id)

  const song = db.prepare(`
    SELECT songs.*, genres.name AS genre_name
    FROM songs JOIN genres ON songs.genre_id = genres.id
    WHERE songs.id = ?
  `).get(id)

  res.json(song)
}

export const patchDuration = (req, res) => {
  const { id } = req.params
  const { duration } = req.body

  if (!duration || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ message: 'Duración inválida' })
  }

  const exists = db.prepare('SELECT id, duration FROM songs WHERE id = ?').get(id)
  if (!exists) return res.status(404).json({ message: 'Canción no encontrada' })

  // Solo actualizar si no tiene duración guardada
  if (exists.duration) return res.json({ skipped: true })

  db.prepare('UPDATE songs SET duration = ? WHERE id = ?').run(Math.round(duration), id)
  res.json({ updated: true })
}

export const remove = (req, res) => {
  const { id } = req.params

  const exists = db.prepare('SELECT id FROM songs WHERE id = ?').get(id)
  if (!exists) return res.status(404).json({ message: 'Canción no encontrada' })

  db.prepare('DELETE FROM songs WHERE id = ?').run(id)
  res.json({ message: 'Canción eliminada' })
}
