import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../api/auth'
import { useAdminStore } from '../store/adminStore'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginAdmin(form)
      login(res.data.token, res.data.username)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            className="bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="bg-gray-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
