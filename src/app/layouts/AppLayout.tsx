import { useState, useCallback } from 'react'
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'
import { PrivateRoute } from '../router/PrivateRoute'
import { ProfileDropdown } from '@/features/users/components/ProfileDropdown'
import { useAuth } from '@/features/auth/hooks'
import { getUserByEmail } from '@/features/users/services/user.service'

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function AppLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const email = searchValue.trim()
      if (!email) {
        navigate('/app/users')
        return
      }
      try {
        const user = await getUserByEmail(email)
        navigate('/app/users', {
          state: { searchEmail: email, searchUser: user ?? null },
        })
      } catch {
        navigate('/app/users', {
          state: { searchEmail: email, searchUser: null },
        })
      } finally {
        setSearchValue('')
      }
    },
    [searchValue, navigate]
  )

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-primary-600/20 text-primary-300'
        : 'text-slate-400 hover:bg-slate-700/80 hover:text-white'
    }`

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
        <header className="border-b border-slate-700/80 bg-slate-800/95 backdrop-blur-sm px-6 py-3 flex items-center justify-between shrink-0 shadow-card">
          <Link
            to="/app/users"
            className="text-xl font-bold tracking-tight text-white hover:text-slate-200 transition"
          >
            Auth System
          </Link>
          <div className="flex-1 max-w-md mx-6 hidden sm:block">
            <form onSubmit={handleSearch} role="search">
              <input
                type="search"
                placeholder="Buscar por e-mail..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition"
                aria-label="Buscar usuário por e-mail"
              />
            </form>
          </div>
          <div className="flex items-center gap-2">
            <ProfileDropdown />
          </div>
        </header>
        <div className="flex flex-1 min-h-0">
          <aside className="w-60 border-r border-slate-700/80 bg-slate-800/60 shrink-0 p-4 flex flex-col">
            <nav className="flex flex-col gap-1" aria-label="Navegação principal">
              <NavLink to="/app/users" className={navLinkClass}>
                Usuários
              </NavLink>
              <NavLink to="/app/profile/edit" className={navLinkClass}>
                Meu perfil
              </NavLink>
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-700/80 hover:text-white transition w-full"
              aria-label="Sair do sistema"
            >
              <LogoutIcon className="w-5 h-5 shrink-0" />
              <span>Sair</span>
            </button>
          </aside>
          <main className="flex-1 overflow-auto bg-slate-900/50">
            <Outlet />
          </main>
        </div>
      </div>
    </PrivateRoute>
  )
}
