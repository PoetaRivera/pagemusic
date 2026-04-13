import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArtistWithSongs } from '../api/artists'
import SongList from '../components/catalog/SongList'
import Spinner from '../components/ui/Spinner'
import { BsArrowLeft, BsPersonFill, BsPlayFill, BsShuffle } from 'react-icons/bs'
import { usePlayerStore } from '../store/playerStore'

export default function ArtistPage() {
  const { name } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { playSong } = usePlayerStore()

  useEffect(() => {
    setLoading(true)
    setError(false)
    getArtistWithSongs(name)
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [name])

  if (loading) return <div className="max-w-screen-xl mx-auto px-6 py-10"><Spinner /></div>

  if (error || !data) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-10 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Artista no encontrado.</p>
        <Link to="/artists" className="mt-4 inline-block" style={{ color: 'var(--accent)' }}>Ver artistas</Link>
      </div>
    )
  }

  const { artist, song_count, genres, songs } = data

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
      <Link
        to="/artists"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <BsArrowLeft /> Todos los artistas
      </Link>

      {/* Header */}
      <div className="flex items-end gap-6 mb-10">
        <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 shadow-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}>
          <BsPersonFill className="text-white opacity-30" style={{ fontSize: '4rem' }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Artista</p>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{artist}</h1>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {genres.map(g => (
                <span key={g} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {song_count} {song_count === 1 ? 'canción' : 'canciones'}
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
