// Script standalone para limpiar songs/genres y re-sembrar
// Uso: node src/reset-and-seed.js
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { seedIfEmpty } from './seed.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../database/pagemusic.db')
const db = new Database(dbPath)
db.pragma('foreign_keys = ON')

console.log('Limpiando songs y genres...')
db.prepare('DELETE FROM plays').run()
db.prepare('DELETE FROM songs').run()
db.prepare('DELETE FROM genres').run()
db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('songs','genres','plays')").run()
console.log('Tablas limpiadas.')

seedIfEmpty(db)
db.close()
console.log('Listo.')
