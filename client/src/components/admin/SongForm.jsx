import { useState, useEffect, useRef } from 'react'
import { uploadAudio } from '../../api/admin'
import { BsUpload, BsLink45Deg, BsCheckCircle } from 'react-icons/bs'

const empty = { title: '', artist: '', album: '', duration: '', audio_url: '', cover_url: '', genre_id: '' }

export default function SongForm({ initial, genres, onSubmit, loading }) {
  const [form, setForm] = useState(empty)
  const [uploadMode, setUploadMode] = useState('url') // 'url' | 'file'
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadedFilename, setUploadedFilename] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        artist: initial.artist || '',
        album: initial.album || '',
        duration: initial.duration ?? '',
        audio_url: initial.audio_url || '',
        cover_url: initial.cover_url || '',
        genre_id: initial.genre_id != null ? String(initial.genre_id) : '',
      })
    } else {
      setForm(empty)
      setUploadedFilename('')
    }
  }, [initial])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!form.genre_id) {
      setUploadError('Selecciona un género antes de subir el archivo')
      e.target.value = ''
      return
    }

    const genreName = genres.find(g => String(g.id) === String(form.genre_id))?.name || 'otros'

    setUploading(true)
    setUploadError('')
    try {
      const res = await uploadAudio(file, genreName)
      const { url, filename } = res.data
      setForm(f => ({
        ...f,
        audio_url: url,
        title: f.title || filename.replace(/\.mp3$/i, '')
      }))
      setUploadedFilename(filename)
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      genre_id: Number(form.genre_id),
      duration: form.duration !== '' ? Number(form.duration) : null,
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm text-gray-400 mb-1 block">Título *</label>
          <input
            value={form.title}
            onChange={set('title')}
            required
            placeholder="Título de la canción"
            className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm text-gray-400 mb-1 block">Artista *</label>
          <input
            value={form.artist}
            onChange={set('artist')}
            required
            placeholder="Nombre del artista"
            className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm text-gray-400 mb-1 block">Álbum</label>
          <input
            value={form.album}
            onChange={set('album')}
            placeholder="Nombre del álbum (opcional)"
            className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-sm text-gray-400 mb-1 block">Duración (segundos)</label>
          <input
            value={form.duration}
            onChange={set('duration')}
            type="number"
            min={1}
            placeholder="Ej: 214 (opcional)"
            className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Género *</label>
        <select
          value={form.genre_id}
          onChange={set('genre_id')}
          required
          className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Selecciona un género</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Audio: toggle URL / Archivo */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-400">Audio *</span>
          <div className="flex bg-gray-700 rounded-lg p-0.5 ml-auto">
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                uploadMode === 'url' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BsLink45Deg /> URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                uploadMode === 'file' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BsUpload /> Subir archivo
            </button>
          </div>
        </div>

        {uploadMode === 'url' ? (
          <input
            value={form.audio_url}
            onChange={set('audio_url')}
            required
            type="url"
            placeholder="https://media.githubusercontent.com/media/usuario/repo/main/..."
            className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        ) : (
          <div>
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg px-4 py-5 text-center cursor-pointer transition-colors ${
                uploading ? 'border-gray-600 opacity-60' : 'border-gray-600 hover:border-purple-500'
              }`}
            >
              {uploading ? (
                <p className="text-gray-400 text-sm">Subiendo archivo...</p>
              ) : uploadedFilename ? (
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <BsCheckCircle className="text-lg" />
                  <span>{uploadedFilename}</span>
                </div>
              ) : (
                <>
                  <BsUpload className="text-gray-500 text-2xl mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Haz clic para seleccionar un MP3</p>
                  <p className="text-gray-600 text-xs mt-1">Máximo 50 MB</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
            <input
              type="text"
              value={form.audio_url}
              required
              readOnly
              className="sr-only"
              tabIndex={-1}
            />
          </div>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">URL de portada <span className="text-gray-600">(opcional)</span></label>
        <input
          value={form.cover_url}
          onChange={set('cover_url')}
          type="url"
          placeholder="https://..."
          className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-1"
      >
        {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Agregar canción'}
      </button>
    </form>
  )
}
