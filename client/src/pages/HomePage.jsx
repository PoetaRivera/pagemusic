import { useEffect, useState } from 'react'
import { getAllGenres } from '../api/genres'
import GenreCard from '../components/catalog/GenreCard'
import Spinner from '../components/ui/Spinner'

export default function HomePage() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllGenres()
      .then(res => setGenres(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Géneros</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Elige un estilo y empieza a escuchar</p>

      {loading ? (
        <Spinner />
      ) : genres.length === 0 ? (
        <p className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No hay géneros disponibles aún.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {genres.map(genre => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      )}
    </div>
  )
}
