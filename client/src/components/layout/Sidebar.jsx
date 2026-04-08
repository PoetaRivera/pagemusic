import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import {
  BsHouseFill, BsMusicNoteList, BsShieldLock,
  BsChevronLeft, BsChevronRight, BsBoxArrowRight, BsX
} from 'react-icons/bs'

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { isAdmin, logout } = useAdminStore()
  const location = useLocation()

  // Cerrar drawer en móvil al navegar
  useEffect(() => {
    onClose?.()
  }, [location.pathname])

  const navItem = (to, Icon, label) => (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
          isActive ? 'text-white' : 'hover:text-white'
        }`
      }
      style={({ isActive }) => ({
        background: isActive ? 'rgba(139,92,246,0.2)' : 'transparent',
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
      })}
      onMouseEnter={e => { if (!e.currentTarget.style.background?.includes('139,92,246')) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => { if (!e.currentTarget.style.background?.includes('139,92,246')) e.currentTarget.style.background = 'transparent' }}
    >
      <Icon className="text-lg flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
      {collapsed && (
        <div className="absolute left-14 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
          style={{ background: 'var(--bg-surface2)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          {label}
        </div>
      )}
    </NavLink>
  )

  const sidebarContent = (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? '64px' : '220px',
        background: 'var(--bg-surface1)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo + botones */}
      <div className="px-3 py-5 flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Page<span style={{ color: 'var(--accent)' }}>Music</span>
          </Link>
        )}
        {/* Botón cerrar en móvil */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors md:hidden ml-auto"
          style={{ color: 'var(--text-muted)' }}
        >
          <BsX className="text-xl" />
        </button>
        {/* Botón colapsar en desktop */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-1.5 rounded-lg transition-colors ml-auto hidden md:block"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {collapsed ? <BsChevronRight /> : <BsChevronLeft />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 flex flex-col gap-1">
        {navItem('/', BsHouseFill, 'Inicio')}
        {navItem('/playlists', BsMusicNoteList, 'Mis listas')}
        {isAdmin && (
          <>
            <div className="my-2" style={{ borderTop: '1px solid var(--border)' }} />
            {navItem('/admin/dashboard', BsShieldLock, 'Panel admin')}
          </>
        )}
      </nav>

      {!isAdmin && (
        <div className="px-2 pb-4">
          {navItem('/admin', BsShieldLock, 'Admin')}
        </div>
      )}

      {isAdmin && (
        <div className="px-2 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
          >
            <BsBoxArrowRight className="text-lg flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Salir</span>}
          </button>
        </div>
      )}
    </aside>
  )

  return (
    <>
      {/* Desktop: sidebar normal */}
      <div className="hidden md:flex flex-shrink-0" style={{ minHeight: '100%' }}>
        {sidebarContent}
      </div>

      {/* Móvil: drawer con overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
          />
          {/* Panel */}
          <div className="relative z-10 w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
