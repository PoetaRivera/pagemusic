import db from '../db.js'

// Registrar una reproducción
export const recordPlay = (req, res) => {
  const { song_id, duration_listened, completed, skipped } = req.body

  if (!song_id) return res.status(400).json({ message: 'song_id requerido' })

  const songExists = db.prepare('SELECT id FROM songs WHERE id = ?').get(song_id)
  if (!songExists) return res.status(404).json({ message: 'Canción no encontrada' })

  db.prepare(`
    INSERT INTO plays (song_id, duration_listened, completed, skipped)
    VALUES (?, ?, ?, ?)
  `).run(
    song_id,
    duration_listened || 0,
    completed ? 1 : 0,
    skipped ? 1 : 0
  )

  res.status(201).json({ recorded: true })
}

// Top canciones más reproducidas
export const topSongs = (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const rows = db.prepare(`
    SELECT s.id, s.title, s.artist, s.cover_url, g.name AS genre_name,
      COUNT(p.id) AS play_count,
      ROUND(AVG(p.duration_listened), 1) AS avg_listened,
      SUM(p.completed) AS times_completed,
      SUM(p.skipped) AS times_skipped
    FROM plays p
    JOIN songs s ON p.song_id = s.id
    JOIN genres g ON s.genre_id = g.id
    GROUP BY p.song_id
    ORDER BY play_count DESC
    LIMIT ?
  `).all(limit)
  res.json(rows)
}

// Top géneros más escuchados
export const topGenres = (req, res) => {
  const rows = db.prepare(`
    SELECT g.id, g.name, COUNT(p.id) AS play_count
    FROM plays p
    JOIN songs s ON p.song_id = s.id
    JOIN genres g ON s.genre_id = g.id
    GROUP BY g.id
    ORDER BY play_count DESC
  `).all()
  res.json(rows)
}

// Actividad por hora del día
export const byHour = (req, res) => {
  const rows = db.prepare(`
    SELECT CAST(strftime('%H', played_at) AS INTEGER) AS hour,
      COUNT(*) AS play_count
    FROM plays
    GROUP BY hour
    ORDER BY hour
  `).all()
  // Rellenar horas sin actividad con 0
  const full = Array.from({ length: 24 }, (_, h) => {
    const found = rows.find(r => r.hour === h)
    return { hour: h, play_count: found ? found.play_count : 0 }
  })
  res.json(full)
}

// Actividad por día de la semana
export const byWeekday = (req, res) => {
  const rows = db.prepare(`
    SELECT CAST(strftime('%w', played_at) AS INTEGER) AS weekday,
      COUNT(*) AS play_count
    FROM plays
    GROUP BY weekday
    ORDER BY weekday
  `).all()
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const full = Array.from({ length: 7 }, (_, d) => {
    const found = rows.find(r => r.weekday === d)
    return { weekday: d, name: names[d], play_count: found ? found.play_count : 0 }
  })
  res.json(full)
}

// Canciones más saltadas
export const mostSkipped = (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const rows = db.prepare(`
    SELECT s.id, s.title, s.artist,
      COUNT(p.id) AS play_count,
      SUM(p.skipped) AS times_skipped,
      ROUND(CAST(SUM(p.skipped) AS REAL) / COUNT(p.id) * 100, 1) AS skip_rate
    FROM plays p
    JOIN songs s ON p.song_id = s.id
    GROUP BY p.song_id
    HAVING play_count >= 3
    ORDER BY skip_rate DESC
    LIMIT ?
  `).all(limit)
  res.json(rows)
}

// Resumen general
export const summary = (req, res) => {
  const total = db.prepare('SELECT COUNT(*) AS count FROM plays').get()
  const today = db.prepare(`
    SELECT COUNT(*) AS count FROM plays
    WHERE date(played_at) = date('now')
  `).get()
  const week = db.prepare(`
    SELECT COUNT(*) AS count FROM plays
    WHERE played_at >= datetime('now', '-7 days')
  `).get()
  const uniqueSongs = db.prepare('SELECT COUNT(DISTINCT song_id) AS count FROM plays').get()
  const completed = db.prepare('SELECT COUNT(*) AS count FROM plays WHERE completed = 1').get()

  res.json({
    total_plays: total.count,
    plays_today: today.count,
    plays_this_week: week.count,
    unique_songs_played: uniqueSongs.count,
    total_completed: completed.count,
    completion_rate: total.count > 0
      ? Math.round((completed.count / total.count) * 100)
      : 0
  })
}
