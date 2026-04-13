import { useEffect, useState } from 'react'
import { getAllArtists } from '../api/artists'
import ArtistCard from '../components/catalog/ArtistCard'
import Spinner from '../components/ui/Spinner'

export default function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllArtists()
      .then(res => setArtists(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Artistas</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        {artists.length > 0 ? `${artists.length} ${artists.length === 1 ? 'artista' : 'artistas'}` : ''}
      </p>

      {loading ? (
        <Spinner />
      ) : artists.length === 0 ? (
        <p className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No hay artistas disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {artists.map(artist => (
            <ArtistCard key={artist.artist} artist={artist} />
          ))}
        </div>
      )}
    </div>
  )
}
