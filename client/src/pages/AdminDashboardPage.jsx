import { useEffect, useState } from 'react'
import { getAllGenres } from '../api/genres'
import { getAllSongs } from '../api/songs'
import { createGenre, updateGenre, deleteGenre, createSong, updateSong, deleteSong } from '../api/admin'
import { getStatsSummary, getTopSongs, getTopGenres, getByHour, getByWeekday, getMostSkipped } from '../api/stats'
import Modal from '../components/ui/Modal'
import GenreForm from '../components/admin/GenreForm'
import SongForm from '../components/admin/SongForm'
import GenreTable from '../components/admin/GenreTable'
import SongTable from '../components/admin/SongTable'
import Spinner from '../components/ui/Spinner'

const TABS = ['Géneros', 'Canciones', 'Estadísticas']

export default function AdminDashboardPage() {
  const [tab, setTab] = useState(0)
  const [genres, setGenres] = useState([])
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  // Stats
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Modal estado
  const [modal, setModal] = useState({ open: false, type: null, item: null })
  // Confirmación borrado
  const [confirm, setConfirm] = useState({ open: false, type: null, item: null })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [g, s] = await Promise.all([getAllGenres(), getAllSongs()])
      setGenres(g.data)
      setSongs(s.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const [summary, topS, topG, hours, weekdays, skipped] = await Promise.all([
        getStatsSummary(), getTopSongs(), getTopGenres(),
        getByHour(), getByWeekday(), getMostSkipped()
      ])
      setStats({
        summary: summary.data,
        topSongs: topS.data,
        topGenres: topG.data,
        byHour: hours.data,
        byWeekday: weekdays.data,
        mostSkipped: skipped.data,
      })
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => { if (tab === 2) loadStats() }, [tab])

  const openCreate = (type) => setModal({ open: true, type, item: null })
  const openEdit = (type, item) => setModal({ open: true, type, item })
  const closeModal = () => { setModal({ open: false, type: null, item: null }); setError('') }

  // --- CRUD Géneros ---
  const handleGenreSubmit = async (data) => {
    setSaving(true)
    setError('')
    try {
      if (modal.item) {
        await updateGenre(modal.item.id, data)
        showToast('Género actualizado correctamente')
      } else {
        await createGenre(data)
        showToast('Género creado correctamente')
      }
      await loadData()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleGenreDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await deleteGenre(confirm.item.id)
      await loadData()
      setConfirm({ open: false, type: null, item: null })
      showToast('Género eliminado')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  // --- CRUD Canciones ---
  const handleSongSubmit = async (data) => {
    setSaving(true)
    setError('')
    try {
      if (modal.item) {
        await updateSong(modal.item.id, data)
        showToast('Canción actualizada correctamente')
      } else {
        await createSong(data)
        showToast('Canción creada correctamente')
      }
      await loadData()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSongDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await deleteSong(confirm.item.id)
      await loadData()
      setConfirm({ open: false, type: null, item: null })
      showToast('Canción eliminada')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Panel de administración</h1>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 p-1 rounded-lg w-fit mb-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors
              ${tab === i ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Panel Géneros */}
      {tab === 0 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-white">Géneros <span className="text-gray-500 font-normal text-sm">({genres.length})</span></h2>
            <button
              onClick={() => openCreate('genre')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nuevo género
            </button>
          </div>
          {loading ? <Spinner /> : (
            <GenreTable
              genres={genres}
              onEdit={(g) => openEdit('genre', g)}
              onDelete={(g) => setConfirm({ open: true, type: 'genre', item: g })}
            />
          )}
        </div>
      )}

      {/* Panel Canciones */}
      {tab === 1 && (
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-white">Canciones <span className="text-gray-500 font-normal text-sm">({songs.length})</span></h2>
            <button
              onClick={() => openCreate('song')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nueva canción
            </button>
          </div>
          {loading ? <Spinner /> : (
            <SongTable
              songs={songs}
              onEdit={(s) => openEdit('song', s)}
              onDelete={(s) => setConfirm({ open: true, type: 'song', item: s })}
            />
          )}
        </div>
      )}

      {/* Panel Estadísticas */}
      {tab === 2 && (
        <div>
          {statsLoading || !stats ? <Spinner /> : (
            <div className="space-y-6">

              {/* Resumen */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Total reproducciones', value: stats.summary.total_plays },
                  { label: 'Hoy', value: stats.summary.plays_today },
                  { label: 'Esta semana', value: stats.summary.plays_this_week },
                  { label: 'Canciones únicas', value: stats.summary.unique_songs_played },
                  { label: 'Completadas', value: stats.summary.total_completed },
                  { label: 'Tasa completado', value: `${stats.summary.completion_rate}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{value}</p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top canciones */}
                <div className="bg-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Top canciones</h3>
                  {stats.topSongs.length === 0
                    ? <p className="text-gray-500 text-sm">Sin datos aún</p>
                    : <div className="space-y-2">
                        {stats.topSongs.map((s, i) => (
                          <div key={s.id} className="flex items-center gap-3">
                            <span className="text-gray-600 text-sm w-5 text-right">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{s.title}</p>
                              <p className="text-xs text-gray-500 truncate">{s.artist}</p>
                            </div>
                            <span className="text-purple-400 font-semibold text-sm flex-shrink-0">{s.play_count}x</span>
                          </div>
                        ))}
                      </div>
                  }
                </div>

                {/* Top géneros */}
                <div className="bg-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Top géneros</h3>
                  {stats.topGenres.length === 0
                    ? <p className="text-gray-500 text-sm">Sin datos aún</p>
                    : <div className="space-y-2">
                        {stats.topGenres.map((g, i) => {
                          const max = stats.topGenres[0].play_count
                          const pct = Math.round((g.play_count / max) * 100)
                          return (
                            <div key={g.id}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300 truncate">{g.name}</span>
                                <span className="text-gray-500 flex-shrink-0 ml-2">{g.play_count}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-gray-700">
                                <div className="h-1.5 rounded-full bg-purple-500 transition-all"
                                  style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                  }
                </div>

                {/* Actividad por hora */}
                <div className="bg-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Actividad por hora</h3>
                  <div className="flex items-end gap-0.5 h-20">
                    {stats.byHour.map(({ hour, play_count }) => {
                      const max = Math.max(...stats.byHour.map(h => h.play_count), 1)
                      const pct = (play_count / max) * 100
                      return (
                        <div key={hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div className="w-full rounded-sm bg-purple-600 opacity-80 hover:opacity-100 transition-all"
                            style={{ height: `${Math.max(pct, 2)}%` }}
                            title={`${hour}:00 — ${play_count} plays`} />
                          {hour % 6 === 0 && (
                            <span className="text-gray-600 text-xs absolute -bottom-5">{hour}h</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex justify-between text-xs text-gray-600 px-0.5">
                    <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
                  </div>
                </div>

                {/* Actividad por día */}
                <div className="bg-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Actividad por día</h3>
                  <div className="flex items-end gap-2 h-20">
                    {stats.byWeekday.map(({ name, play_count }) => {
                      const max = Math.max(...stats.byWeekday.map(d => d.play_count), 1)
                      const pct = (play_count / max) * 100
                      return (
                        <div key={name} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full rounded-sm bg-purple-600 opacity-80 hover:opacity-100 transition-all"
                            style={{ height: `${Math.max(pct, 2)}%` }}
                            title={`${name} — ${play_count} plays`} />
                          <span className="text-gray-500 text-xs">{name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Más saltadas */}
              {stats.mostSkipped.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Canciones más saltadas</h3>
                  <div className="space-y-2">
                    {stats.mostSkipped.map((s) => (
                      <div key={s.id} className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{s.title}</p>
                          <p className="text-xs text-gray-500">{s.artist}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-red-400 font-semibold">{s.skip_rate}% saltadas</p>
                          <p className="text-xs text-gray-600">{s.times_skipped} de {s.play_count} veces</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Sección ayuda GitHub LFS */}
      <details className="mt-8 bg-gray-800 rounded-xl">
        <summary className="px-6 py-4 cursor-pointer text-gray-400 hover:text-white text-sm font-medium select-none">
          ¿Cómo subir archivos de audio? (GitHub LFS)
        </summary>
        <div className="px-6 pb-5 text-sm text-gray-400 space-y-3 border-t border-gray-700 pt-4">
          <p><strong className="text-white">1. Configurar el repositorio de almacenamiento:</strong></p>
          <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto text-gray-300 text-xs">
{`git clone https://github.com/usuario/pagemusic-storage.git
cd pagemusic-storage
git lfs install
git lfs track "*.mp3"
git add .gitattributes && git commit -m "Configure LFS" && git push`}
          </pre>
          <p><strong className="text-white">2. Subir un archivo de audio:</strong></p>
          <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto text-gray-300 text-xs">
{`cp /ruta/cancion.mp3 ./audio/genero/
git add audio/genero/cancion.mp3
git commit -m "Add: Artista - Titulo.mp3"
git push`}
          </pre>
          <p className="text-gray-500">URL resultante: <code className="text-purple-300 text-xs">https://raw.githubusercontent.com/usuario/pagemusic-storage/main/audio/genero/cancion.mp3</code></p>
          <p><strong className="text-white">3. Subir portada:</strong></p>
          <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto text-gray-300 text-xs">
{`cp /ruta/cover.jpg ./covers/
git add covers/artista-titulo.jpg
git commit -m "Add cover" && git push`}
          </pre>
          <p className="text-gray-500">URL resultante: <code className="text-purple-300 text-xs">https://raw.githubusercontent.com/usuario/pagemusic-storage/main/covers/artista-titulo.jpg</code></p>
          <p><strong className="text-white">4.</strong> Copia las URLs y pégalas en el formulario de "Nueva canción".</p>
          <p className="text-yellow-600">⚠ Límite gratuito de GitHub LFS: 1 GB almacenamiento y 1 GB/mes de ancho de banda.</p>
        </div>
      </details>

      {/* Modal crear / editar */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={
          modal.type === 'genre'
            ? (modal.item ? 'Editar género' : 'Nuevo género')
            : (modal.item ? 'Editar canción' : 'Nueva canción')
        }
      >
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {modal.type === 'genre' && (
          <GenreForm initial={modal.item} onSubmit={handleGenreSubmit} loading={saving} />
        )}
        {modal.type === 'song' && (
          <SongForm initial={modal.item} genres={genres} onSubmit={handleSongSubmit} loading={saving} />
        )}
      </Modal>

      {/* Modal confirmación borrado */}
      <Modal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, type: null, item: null })}
        title="Confirmar eliminación"
      >
        <p className="text-gray-300 mb-5">
          ¿Seguro que quieres eliminar <strong className="text-white">"{confirm.item?.name || confirm.item?.title}"</strong>?
          Esta acción no se puede deshacer.
        </p>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirm({ open: false, type: null, item: null })}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirm.type === 'genre' ? handleGenreDelete : handleSongDelete}
            disabled={saving}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
