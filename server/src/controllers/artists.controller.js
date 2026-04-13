import db from '../db.js'

export const getAll = (req, res) => {
  const artists = db.prepare(`
    SELECT
      songs.artist,
      COUNT(songs.id) AS song_count,
      GROUP_CONCAT(DISTINCT genres.name ORDER BY genres.name) AS genres
    FROM songs
    JOIN genres ON songs.genre_id = genres.id
    GROUP BY songs.artist
    ORDER BY songs.artist
  `).all()

  res.json(artists.map(a => ({
    ...a,
    genres: a.genres ? a.genres.split(',') : []
  })))
}

export const getByName = (req, res) => {
  const { name } = req.params
  const artist = decodeURIComponent(name)

  const songs = db.prepare(`
    SELECT songs.*, genres.name AS genre_name
    FROM songs
    JOIN genres ON songs.genre_id = genres.id
    WHERE songs.artist = ?
    ORDER BY songs.title
  `).all(artist)

  if (songs.length === 0) {
    return res.status(404).json({ message: 'Artista no encontrado' })
  }

  const genres = [...new Set(songs.map(s => s.genre_name))]

  res.json({ artist, song_count: songs.length, genres, songs })
}
