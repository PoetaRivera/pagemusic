import { Link } from 'react-router-dom'
import { BsPersonFill, BsPlayFill } from 'react-icons/bs'

const GRADIENTS = [
  'from-violet-900 to-purple-800',
  'from-blue-900 to-indigo-800',
  'from-rose-900 to-pink-800',
  'from-emerald-900 to-teal-800',
  'from-amber-900 to-orange-800',
  'from-cyan-900 to-sky-800',
  'from-red-900 to-rose-800',
  'from-fuchsia-900 to-violet-800',
]

function getGradient(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export default function ArtistCard({ artist }) {
  const gradient = getGradient(artist.artist)

  return (
    <Link
      to={`/artist/${encodeURIComponent(artist.artist)}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.25)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'}
    >
      <div className="aspect-square relative overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <BsPersonFill className="text-6xl text-white opacity-20" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white text-sm font-semibold truncate drop-shadow-lg">{artist.artist}</h3>
          <p className="text-xs mt-0.5 drop-shadow" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {artist.song_count} {artist.song_count === 1 ? 'canción' : 'canciones'}
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="rounded-full p-3 transition-transform group-hover:scale-110"
            style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <BsPlayFill className="text-white text-xl" />
          </div>
        </div>
      </div>
    </Link>
  )
}
