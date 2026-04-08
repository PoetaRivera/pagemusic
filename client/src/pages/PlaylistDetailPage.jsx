import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePlaylistStore } from '../store/playlistStore'
import { usePlayerStore } from '../store/playerStore'
import {
  BsArrowLeft, BsPlayFill, BsTrash, BsMusicNote,
  BsMusicNoteList, BsPencil, BsCheck, BsX, BsShuffle
} from 'react-icons/bs'
import SongCard from '../components/catalog/SongCard'

const PLAYLIST_GRADIENTS = [
  ['#4c1d95', '#7c3aed'],
  ['#881337', '#e11d48'],
  ['#1e3a5f', '#0ea5e9'],
  ['#064e3b', '#10b981'],
  ['#78350f', '#f59e0b'],
  ['#1e1b4b', '#6366f1'],
]

function PlaylistCover({ playlist, size = 160 }) {
  const covers = playlist.songs.filter(s => s.cover_url).slice(0, 4)
  const gradient = PLAYLIST_GRADIENTS[playlist.name.length % PLAYLIST_GRADIENTS.length]

  if (covers.length >= 4) {
    return (
      <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: size, height: size }}>
        {covers.map((s, i) => (
          <img key={i} src={s.cover_url} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
    )
  }

  if (covers.length === 1) {
    return (
      <img src={covers[0].cover_url} alt="" className="rounded-xl object-cover flex-shrink-0 shadow-xl"
        style={{ width: size, height: size }} />
    )
  }

  return (
    <div className="rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
      <BsMusicNoteList className="text-white opacity-40" style={{ fontSize: size * 0.35 }} />
    </div>
  )
}

export default function PlaylistDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPlaylist, removeSong, renamePlaylist, deletePlaylist } = usePlaylistStore()
  const { playSong, toggleShuffle, isShuffle } = usePlayerStore()
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')

  const playlist = getPlaylist(id)

  if (!playlist) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-10 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Lista no encontrada.</p>
        <Link to="/playlists" className="mt-4 inline-block" style={{ color: 'var(--accent)' }}>
          Volver a mis listas
        </Link>
      </div>
    )
  }

  const handlePlay = () => {
    if (playlist.songs.length === 0) return
    playSong(playlist.songs[0], playlist.songs)
  }

  const handleShuffle = () => {
    if (playlist.songs.length === 0) return
    const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5)
    playSong(shuffled[0], shuffled)
  }

  const handleRenameSubmit = (e) => {
    e.preventDefault()
    if (nameInput.trim()) renamePlaylist(id, nameInput.trim())
    setEditing(false)
  }

  const handleDelete = () => {
    deletePlaylist(id)
    navigate('/playlists')
  }

  const startEditing = () => {
    setNameInput(playlist.name)
    setEditing(true)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <Link to="/playlists"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <BsArrowLeft /> Mis listas
      </Link>

      {/* Header */}
      <div className="flex items-end gap-6 mb-10">
        <PlaylistCover playlist={playlist} size={160} />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Lista</p>

          {editing ? (
            <form onSubmit={handleRenameSubmit} className="flex items-center gap-2 mb-2">
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="text-2xl font-bold px-3 py-1 rounded-lg outline-none"
                style={{
                  background: 'var(--bg-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(139,92,246,0.5)',
                  maxWidth: '360px',
                }}
              />
              <button type="submit" style={{ color: '#4ade80' }}><BsCheck className="text-xl" /></button>
              <button type="button" onClick={() => setEditing(false)} style={{ color: 'var(--text-muted)' }}><BsX className="text-xl" /></button>
            </form>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {playlist.name}
              </h1>
              <button onClick={startEditing} className="mt-1 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <BsPencil className="text-sm" />
              </button>
            </div>
          )}

          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {playlist.songs.length} {playlist.songs.length === 1 ? 'canción' : 'canciones'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              disabled={playlist.songs.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--accent)', boxShadow: '0 4px 20px var(--accent-glow)' }}
            >
              <BsPlayFill className="text-base" />
              Reproducir
            </button>
            <button
              onClick={handleShuffle}
              disabled={playlist.songs.length === 0}
              className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <BsShuffle />
              Aleatorio
            </button>
            <button
              onClick={handleDelete}
              className="p-3 rounded-full transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
              title="Eliminar lista"
            >
              <BsTrash />
            </button>
          </div>
        </div>
      </div>

      {/* Lista vacía */}
      {playlist.songs.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <BsMusicNote className="text-4xl mx-auto mb-3 opacity-20" />
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Esta lista está vacía</p>
          <p className="text-sm mt-1">Agrega canciones usando el botón <strong>+</strong> en cada canción</p>
        </div>
      )}

      {/* Canciones */}
      <div className="space-y-0.5">
        {playlist.songs.map((song, index) => (
          <div key={song.id} className="group flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <SongCard song={song} queue={playlist.songs} index={index} />
            </div>
            <button
              onClick={() => removeSong(id, song.id)}
              className="p-1.5 rounded-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all mr-2"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
              title="Quitar de la lista"
            >
              <BsTrash className="text-sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
