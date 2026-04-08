import { Link } from 'react-router-dom'
import { BsMusicNoteBeamed, BsPlayFill } from 'react-icons/bs'

const GENRE_GRADIENTS = [
  'from-purple-900 to-indigo-800',
  'from-rose-900 to-pink-800',
  'from-blue-900 to-cyan-800',
  'from-amber-900 to-orange-800',
  'from-emerald-900 to-teal-800',
  'from-violet-900 to-fuchsia-800',
  'from-red-900 to-rose-800',
  'from-sky-900 to-blue-800',
]

function getGradient(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return GENRE_GRADIENTS[Math.abs(hash) % GENRE_GRADIENTS.length]
}

export default function GenreCard({ genre }) {
  const gradient = getGradient(genre.name)

  return (
    <Link
      to={`/genre/${genre.id}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.25)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'}
    >
      <div className="aspect-square relative overflow-hidden">
        {genre.cover_url ? (
          <img
            src={genre.cover_url}
            alt={genre.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <BsMusicNoteBeamed className="text-4xl text-white opacity-40" />
          </div>
        )}

        {/* Overlay gradiente permanente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Nombre sobre la imagen */}
        <h3 className="absolute bottom-2 left-3 right-3 text-white text-sm font-semibold truncate drop-shadow-lg">
          {genre.name}
        </h3>

        {/* Play button en hover */}
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
