import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGenreWithSongs } from '../api/genres'
import SongList from '../components/catalog/SongList'
import Spinner from '../components/ui/Spinner'
import { BsArrowLeft, BsMusicNoteBeamed, BsPlayFill, BsShuffle } from 'react-icons/bs'
import { usePlayerStore } from '../store/playerStore'

export default function GenrePage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { playSong } = usePlayerStore()

  useEffect(() => {
    setLoading(true)
    setError(false)
    getGenreWithSongs(id)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-screen-xl mx-auto px-6 py-10"><Spinner /></div>

  if (error || !data) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-10 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Género no encontrado.</p>
        <Link to="/" className="mt-4 inline-block" style={{ color: 'var(--accent)' }}>Volver al inicio</Link>
      </div>
    )
  }

  const { genre, songs } = data

  const handlePlayAll = () => {
    if (songs.length > 0) playSong(songs[0], songs)
  }

  const handleShuffle = () => {
    if (songs.length === 0) return
    const shuffled = [...songs].sort(() => Math.random() - 0.5)
    playSong(shuffled[0], shuffled)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <Link to="/"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <BsArrowLeft /> Todos los géneros
      </Link>

      {/* Header */}
      <div className="flex items-end gap-6 mb-10">
        <div className="w-36 h-36 rounded-xl overflow-hidden flex-shrink-0 shadow-xl"
          style={{ background: 'var(--bg-hover)' }}>
          {genre.cover_url
            ? <img src={genre.cover_url} alt={genre.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}>
                <BsMusicNoteBeamed className="text-white opacity-40" style={{ fontSize: '3rem' }} />
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Género</p>
          <h1 className="text-4xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{genre.name}</h1>
          {genre.description && (
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{genre.description}</p>
          )}
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {songs.length} {songs.length === 1 ? 'canción' : 'canciones'}
          </p>

          <div className="flex items-center gap-3">
            {songs.length > 0 && (
              <>
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', boxShadow: '0 4px 20px var(--accent-glow)' }}
                >
                  <BsPlayFill className="text-base" />
                  Reproducir
                </button>
                <button
                  onClick={handleShuffle}
                  className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <BsShuffle />
                  Aleatorio
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <SongList songs={songs} />
    </div>
  )
}
