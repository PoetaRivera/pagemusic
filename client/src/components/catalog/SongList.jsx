import SongCard from './SongCard'

export default function SongList({ songs }) {
  if (!songs.length) {
    return <p className="text-center py-10" style={{ color: 'var(--text-muted)' }}>No hay canciones en este género.</p>
  }
  return (
    <div className="flex flex-col gap-0.5">
      {songs.map((song, index) => (
        <SongCard key={song.id} song={song} queue={songs} index={index} />
      ))}
    </div>
  )
}
