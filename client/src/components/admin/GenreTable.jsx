import { BsPencil, BsTrash, BsMusicNoteBeamed } from 'react-icons/bs'

export default function GenreTable({ genres, onEdit, onDelete }) {
  if (!genres.length) {
    return <p className="text-gray-500 text-center py-10">No hay géneros. Crea el primero.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left py-3 px-2 font-medium">Portada</th>
            <th className="text-left py-3 px-2 font-medium">Nombre</th>
            <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Descripción</th>
            <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Canciones</th>
            <th className="py-3 px-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {genres.map(genre => (
            <tr key={genre.id} className="hover:bg-gray-800/50 transition-colors">
              <td className="py-3 px-2">
                <div className="w-10 h-10 bg-gray-700 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {genre.cover_url
                    ? <img src={genre.cover_url} alt={genre.name} className="w-full h-full object-cover" />
                    : <BsMusicNoteBeamed className="text-gray-500" />
                  }
                </div>
              </td>
              <td className="py-3 px-2 text-white font-medium">{genre.name}</td>
              <td className="py-3 px-2 text-gray-400 hidden sm:table-cell max-w-xs truncate">
                {genre.description || '—'}
              </td>
              <td className="py-3 px-2 text-gray-300 hidden md:table-cell">
                {genre.song_count ?? 0}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(genre)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  >
                    <BsPencil />
                  </button>
                  <button
                    onClick={() => onDelete(genre)}
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
