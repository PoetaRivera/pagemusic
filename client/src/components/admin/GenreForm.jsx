import { useState, useEffect } from 'react'

const empty = { name: '', description: '', cover_url: '' }

export default function GenreForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(initial ? { name: initial.name, description: initial.description || '', cover_url: initial.cover_url || '' } : empty)
  }, [initial])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Nombre *</label>
        <input
          value={form.name}
          onChange={set('name')}
          required
          placeholder="Ej: Salsa, Pop Rock..."
          className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={2}
          placeholder="Descripción breve del género..."
          className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>
      <div>
        <label className="text-sm text-gray-400 mb-1 block">URL de portada</label>
        <input
          value={form.cover_url}
          onChange={set('cover_url')}
          type="url"
          placeholder="https://raw.githubusercontent.com/..."
          className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-1"
      >
        {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear género'}
      </button>
    </form>
  )
}
