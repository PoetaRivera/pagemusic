import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlaylistStore } from '../store/playlistStore'
import { usePlayerStore } from '../store/playerStore'
import { BsPlayFill, BsTrash, BsPlusLg, BsMusicNoteList, BsMusicNote } from 'react-icons/bs'

const PLAYLIST_GRADIENTS = [
  ['#4c1d95', '#7c3aed'],
  ['#881337', '#e11d48'],
  ['#1e3a5f', '#0ea5e9'],
  ['#064e3b', '#10b981'],
  ['#78350f', '#f59e0b'],
  ['#1e1b4b', '#6366f1'],
]

function PlaylistCover({ playlist, idx }) {
  const gradient = PLAYLIST_GRADIENTS[idx % PLAYLIST_GRADIENTS.length]
  const covers = playlist.songs.filter(s => s.cover_url).slice(0, 4)

  if (covers.length >= 4) {
    return (
      <div className="w-full aspect-square grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden">
        {covers.map((s, i) => (
          <img key={i} src={s.cover_url} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
    )
  }

  if (covers.length === 1) {
    return <img src={covers[0].cover_url} alt="" className="w-full aspect-square object-cover rounded-xl" />
  }

  return (
    <div className="w-full aspect-square rounded-xl flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
      <BsMusicNoteList className="text-white opacity-40" style={{ fontSize: '2.5rem' }} />
    </div>
  )
}

export default function PlaylistsPage() {
  const { playlists, createPlaylist, deletePlaylist } = usePlaylistStore()
  const { playSong } = usePlayerStore()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    createPlaylist(newName.trim())
    setNewName('')
    setCreating(false)
  }

  const handlePlay = (playlist) => {
    if (playlist.songs.length === 0) return
    playSong(playlist.songs[0], playlist.songs)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Mis listas</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {playlists.length} {playlists.length === 1 ? 'lista' : 'listas'}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <BsPlusLg />
          Nueva lista
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate}
          className="rounded-xl p-5 mb-6 flex gap-3 items-center"
          style={{ background: 'var(--bg-surface2)', border: '1px solid var(--border)' }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nombre de la lista..."
            className="flex-1 px-4 py-2.5 rounded-lg outline-none text-sm"
            style={{
              background: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(139,92,246,0.4)',
            }}
          />
          <button type="submit"
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--accent)' }}>
            Crear
          </button>
          <button type="button" onClick={() => setCreating(false)}
            className="px-3 py-2.5 text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            Cancelar
          </button>
        </form>
      )}

      {playlists.length === 0 && !creating && (
        <div className="text-center py-24" style={{ color: 'var(--text-muted)' }}>
          <BsMusicNoteList className="text-5xl mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Aún no tienes listas</p>
          <p className="text-sm mt-1">Crea una lista y agrega canciones desde cualquier género</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playlists.map((playlist, idx) => (
          <div key={playlist.id}
            className="group rounded-xl p-3 flex flex-col gap-3 transition-colors cursor-pointer"
            style={{ background: 'var(--bg-surface1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface1)'}>

            <div className="relative">
              <Link to={`/playlist/${playlist.id}`}>
                <PlaylistCover playlist={playlist} idx={idx} />
              </Link>
              {/* Play button on hover */}
              <button
                onClick={() => handlePlay(playlist)}
                disabled={playlist.songs.length === 0}
                className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 disabled:opacity-30"
                style={{ background: 'var(--accent)', boxShadow: '0 4px 16px var(--accent-glow)' }}
              >
                <BsPlayFill className="text-sm ml-0.5" />
              </button>
            </div>

            <div className="flex items-start justify-between gap-2">
              <Link to={`/playlist/${playlist.id}`} className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {playlist.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'canción' : 'canciones'}
                </p>
              </Link>
              <button
                onClick={() => deletePlaylist(playlist.id)}
                className="p-1.5 rounded-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
              >
                <BsTrash className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
