import db from '../db.js'

export const getAll = (req, res) => {
  const genres = db.prepare('SELECT * FROM genres ORDER BY name').all()
  res.json(genres)
}

export const getById = (req, res) => {
  const genre = db.prepare('SELECT * FROM genres WHERE id = ?').get(req.params.id)
  if (!genre) return res.status(404).json({ message: 'Género no encontrado' })
  res.json(genre)
}

export const create = (req, res) => {
  const { name, description, cover_url } = req.body
  try {
    const result = db
      .prepare('INSERT INTO genres (name, description, cover_url) VALUES (?, ?, ?)')
      .run(name, description || null, cover_url || null)
    const genre = db.prepare('SELECT * FROM genres WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(genre)
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ message: 'Ya existe un género con ese nombre' })
    }
    throw err
  }
}

export const update = (req, res) => {
  const { name, description, cover_url } = req.body
  const { id } = req.params

  const exists = db.prepare('SELECT id FROM genres WHERE id = ?').get(id)
  if (!exists) return res.status(404).json({ message: 'Género no encontrado' })

  try {
    db.prepare('UPDATE genres SET name = ?, description = ?, cover_url = ? WHERE id = ?')
      .run(name, description || null, cover_url || null, id)
    const genre = db.prepare('SELECT * FROM genres WHERE id = ?').get(id)
    res.json(genre)
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ message: 'Ya existe un género con ese nombre' })
    }
    throw err
  }
}

export const remove = (req, res) => {
  const { id } = req.params

  const exists = db.prepare('SELECT id FROM genres WHERE id = ?').get(id)
  if (!exists) return res.status(404).json({ message: 'Género no encontrado' })

  const hasSongs = db.prepare('SELECT id FROM songs WHERE genre_id = ?').get(id)
  if (hasSongs) {
    return res.status(400).json({ message: 'No se puede eliminar un género que tiene canciones asignadas' })
  }

  db.prepare('DELETE FROM genres WHERE id = ?').run(id)
  res.json({ message: 'Género eliminado' })
}
