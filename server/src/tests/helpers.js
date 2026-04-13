import db from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export function resetDB() {
  db.exec('DELETE FROM plays')
  db.exec('DELETE FROM songs')
  db.exec('DELETE FROM genres')
  db.exec('DELETE FROM admin')
  const hash = bcrypt.hashSync('admin1234', 10)
  db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)').run('admin', hash)
}

export function getAdminToken() {
  return jwt.sign({ id: 1, username: 'admin' }, JWT_SECRET, { expiresIn: '1h' })
}

export function seedGenre(name = 'Rock', description = null) {
  const result = db.prepare('INSERT INTO genres (name, description) VALUES (?, ?)').run(name, description)
  return db.prepare('SELECT * FROM genres WHERE id = ?').get(result.lastInsertRowid)
}

export function seedSong(genreId, overrides = {}) {
  const song = {
    title: 'Test Song',
    artist: 'Test Artist',
    album: null,
    duration: 180,
    audio_url: 'http://example.com/song.mp3',
    cover_url: null,
    genre_id: genreId,
    ...overrides
  }
  const result = db.prepare(`
    INSERT INTO songs (title, artist, album, duration, audio_url, cover_url, genre_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(song.title, song.artist, song.album, song.duration, song.audio_url, song.cover_url, song.genre_id)
  return db.prepare('SELECT * FROM songs WHERE id = ?').get(result.lastInsertRowid)
}
