import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-card hover:shadow-card-hover hover:from-primary-400 hover:to-primary-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menu do perfil"
      >
        {initials}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700/80 bg-slate-800 shadow-dropdown py-1.5 z-50"
          role="menu"
        >
          <Link
            to="/app/profile/edit"
            className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700/80 hover:text-white rounded-lg mx-1.5 transition"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Meu perfil
          </Link>
          <button
            type="button"
            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700/80 hover:text-white rounded-lg mx-1.5 transition"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              logout()
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
