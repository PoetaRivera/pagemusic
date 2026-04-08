import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchSongs } from '../../api/songs'
import { usePlayerStore } from '../../store/playerStore'
import { BsSearch, BsList } from 'react-icons/bs'

export default function Navbar({ onMenuClick }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()
  const { playSong } = usePlayerStore()

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim().length > 0) {
      const { data } = await searchSongs(value)
      setResults(data)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const handleSelect = (song) => {
    setQuery('')
    setResults([])
    setShowResults(false)
    playSong(song, results)
    navigate('/')
  }

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200)
  }

  return (
    <nav className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3"
      style={{
        background: 'rgba(13,13,15,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>

      {/* Hamburguesa — solo móvil */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg flex-shrink-0 transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <BsList className="text-xl" />
      </button>

      {/* Barra de búsqueda */}
      <div className="relative flex-1 max-w-md mx-auto">
        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Buscar canciones, artistas..."
          value={query}
          onChange={handleSearch}
          onBlur={handleBlur}
          onFocus={() => query.trim().length > 0 && setShowResults(true)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-full focus:outline-none transition-all"
          style={{
            background: 'var(--bg-surface2)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
          onFocusCapture={e => e.currentTarget.style.border = '1px solid rgba(139,92,246,0.5)'}
          onBlurCapture={e => e.currentTarget.style.border = '1px solid var(--border)'}
        />

        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-2 w-full rounded-xl shadow-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(22,22,24,0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              maxHeight: '320px',
              overflowY: 'auto',
            }}>
            {results.map((song) => (
              <button
                key={song.id}
                onClick={() => handleSelect(song)}
                className="w-full text-left px-4 py-3 transition-colors"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{song.title}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{song.artist} · {song.genre_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
