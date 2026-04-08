import { useState, useRef, useEffect } from 'react'
import { BsMusicNote, BsPlayFill, BsPauseFill, BsPlusCircle, BsCheck } from 'react-icons/bs'
import { usePlayerStore } from '../../store/playerStore'
import { usePlaylistStore } from '../../store/playlistStore'

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function SongCard({ song, queue, index }) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore()
  const { playlists, addSong, createPlaylist } = usePlaylistStore()
  const isActive = currentSong?.id === song.id

  const [showMenu, setShowMenu] = useState(false)
  const [added, setAdded] = useState(null)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [hovered, setHovered] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
        setCreating(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  const handleClick = () => {
    if (isActive) togglePlay()
    else playSong(song, queue)
  }

  const handleAddToPlaylist = (e, playlistId) => {
    e.stopPropagation()
    addSong(playlistId, song)
    setAdded(playlistId)
    setTimeout(() => { setAdded(null); setShowMenu(false) }, 1000)
  }

  const handleCreateAndAdd = (e) => {
    e.stopPropagation()
    if (!newName.trim()) return
    const id = createPlaylist(newName.trim())
    addSong(id, song)
    setNewName('')
    setCreating(false)
    setAdded(id)
    setTimeout(() => { setAdded(null); setShowMenu(false) }, 1000)
  }

  const toggleMenu = (e) => {
    e.stopPropagation()
    setShowMenu(v => !v)
    setCreating(false)
  }

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group relative transition-colors"
      style={{
        background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
      }}
      onMouseEnter={e => { setHovered(true); if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => { setHovered(false); if (!isActive) e.currentTarget.style.background = 'transparent' }}
    >
      {/* Número / play button */}
      <div className="w-8 text-center flex-shrink-0 flex items-center justify-center" onClick={handleClick}>
        {isActive && isPlaying ? (
          <div className="equalizer">
            <span /><span /><span />
          </div>
        ) : hovered ? (
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent)' }}>
            {isActive
              ? <BsPauseFill className="text-white text-xs" />
              : <BsPlayFill className="text-white text-xs ml-0.5" />
            }
          </div>
        ) : (
          <span className="text-xs" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
            {index != null ? index + 1 : ''}
          </span>
        )}
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden shadow-md" onClick={handleClick}
        style={{ background: 'var(--bg-hover)' }}>
        {song.cover_url
          ? <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <BsMusicNote className="text-sm" style={{ color: 'var(--text-muted)' }} />
            </div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0" onClick={handleClick}>
        <p className="text-sm font-medium truncate"
          style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
          {song.title}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{song.artist}</p>
      </div>

      {/* Duración */}
      <span className="text-xs flex-shrink-0 mr-1" style={{ color: 'var(--text-muted)' }}>
        {formatDuration(song.duration)}
      </span>

      {/* Botón + playlist */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
          title="Agregar a lista"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <BsPlusCircle className="text-base" />
        </button>

        {showMenu && (
          <div className="absolute right-0 bottom-full mb-1 w-52 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              background: 'rgba(22,22,24,0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
            }}>
            <p className="text-xs px-3 pt-3 pb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Agregar a lista
            </p>

            {playlists.length === 0 && !creating && (
              <p className="text-xs px-3 pb-2" style={{ color: 'var(--text-muted)' }}>No tienes listas aún</p>
            )}

            {playlists.map(pl => (
              <button
                key={pl.id}
                onClick={(e) => handleAddToPlaylist(e, pl.id)}
                className="w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="truncate">{pl.name}</span>
                {added === pl.id && <BsCheck className="text-green-400 flex-shrink-0" />}
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px' }}>
              {creating ? (
                <form onSubmit={handleCreateAndAdd} onClick={e => e.stopPropagation()} className="px-3 py-2 flex gap-2">
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Nombre de la lista"
                    className="flex-1 text-xs px-2 py-1.5 rounded outline-none"
                    style={{
                      background: 'var(--bg-hover)',
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(139,92,246,0.4)',
                    }}
                  />
                  <button type="submit" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Crear</button>
                </form>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setCreating(true) }}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--accent)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  + Nueva lista
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
