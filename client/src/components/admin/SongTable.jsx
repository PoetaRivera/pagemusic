import { BsPencil, BsTrash, BsMusicNote } from 'react-icons/bs'

function formatDuration(seconds) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function SongTable({ songs, onEdit, onDelete }) {
  if (!songs.length) {
    return <p className="text-gray-500 text-center py-10">No hay canciones. Agrega la primera.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left py-3 px-2 font-medium">Portada</th>
            <th className="text-left py-3 px-2 font-medium">Título</th>
            <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Artista</th>
            <th className="text-left py-3 px-2 font-medium hidden lg:table-cell">Género</th>
            <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Duración</th>
            <th className="py-3 px-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {songs.map(song => (
            <tr key={song.id} className="hover:bg-gray-800/50 transition-colors">
              <td className="py-3 px-2">
                <div className="w-10 h-10 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                  {song.cover_url
                    ? <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
                    : <BsMusicNote className="text-gray-500" />
                  }
                </div>
              </td>
              <td className="py-3 px-2 text-white font-medium max-w-[150px] truncate">{song.title}</td>
              <td className="py-3 px-2 text-gray-400 hidden md:table-cell">{song.artist}</td>
              <td className="py-3 px-2 hidden lg:table-cell">
                <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                  {song.genre_name}
                </span>
              </td>
              <td className="py-3 px-2 text-gray-400 hidden sm:table-cell">{formatDuration(song.duration)}</td>
              <td className="py-3 px-2">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(song)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  >
                    <BsPencil />
                  </button>
                  <button
                    onClick={() => onDelete(song)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                  >
                    <BsTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
