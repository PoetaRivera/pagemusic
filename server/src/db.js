import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import path from 'path'
import bcrypt from 'bcryptjs'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from './config.js'
import { seedIfEmpty } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '../database/pagemusic.db')

const db = new Database(dbPath)

// Habilitar foreign keys
db.pragma('foreign_keys = ON')
db.pragma('journal_mode = WAL')

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration INTEGER,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    genre_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_listened REAL,
    completed INTEGER DEFAULT 0,
    skipped INTEGER DEFAULT 0,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
  );
`)

// Índices para queries frecuentes en plays
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_plays_song_id  ON plays(song_id);
  CREATE INDEX IF NOT EXISTS idx_plays_played_at ON plays(played_at);
`)

// Seed del admin si no existe
const adminExists = db.prepare('SELECT id FROM admin WHERE username = ?').get(ADMIN_USERNAME)
if (!adminExists) {
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
  db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)').run(ADMIN_USERNAME, hash)
  console.log(`Admin creado: ${ADMIN_USERNAME}`)
}

// Seed de géneros y canciones si la DB está vacía
if (process.env.NODE_ENV !== 'test') {
  seedIfEmpty(db)
}

export default db
