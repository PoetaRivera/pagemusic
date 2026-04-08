import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import {
  BsHouseFill, BsMusicNoteList, BsShieldLock,
  BsChevronLeft, BsChevronRight, BsBoxArrowRight
} from 'react-icons/bs'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { isAdmin, logout } = useAdminStore()

  const navItem = (to, Icon, label) => (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
          isActive
            ? 'text-white'
            : 'hover:text-white'
        }`
      }
      style={({ isActive }) => ({
        background: isActive ? 'rgba(139,92,246,0.2)' : 'transparent',
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
      })}
      onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--bg-hover)' }}
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

  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? '64px' : '220px',
        background: 'var(--bg-surface1)',
        borderRight: '1px solid var(--border)',
        minHeight: '100%',
      }}
    >
      {/* Logo */}
      <div className="px-3 py-5 flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Page<span style={{ color: 'var(--accent)' }}>Music</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-1.5 rounded-lg transition-colors ml-auto"
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

      {/* Acceso admin si no está logueado */}
      {!isAdmin && (
        <div className="px-2 pb-4">
          {navItem('/admin', BsShieldLock, 'Admin')}
        </div>
      )}

      {/* Logout si es admin */}
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
}
