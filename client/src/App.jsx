import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAdminStore } from './store/adminStore'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import GlobalPlayer from './components/player/GlobalPlayer'
import HomePage from './pages/HomePage'
import GenrePage from './pages/GenrePage'
import PlaylistsPage from './pages/PlaylistsPage'
import PlaylistDetailPage from './pages/PlaylistDetailPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ArtistsPage from './pages/ArtistsPage'
import ArtistPage from './pages/ArtistPage'

function AdminProtectedRoute() {
  const { isAdmin } = useAdminStore()
  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="flex flex-1 overflow-hidden" style={{ paddingBottom: '76px' }}>
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
          <main className="flex-1 overflow-y-auto" style={{ color: 'var(--text-primary)' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/genre/:id" element={<GenrePage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artist/:name" element={<ArtistPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <GlobalPlayer />
      </div>
    </BrowserRouter>
  )
}
