import type { User } from '../types'

export interface UserCardProps {
  user: User
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-800 p-6 flex items-center gap-4 shadow-card transition hover:shadow-card-hover hover:border-slate-600/80">
      <div
        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg shrink-0 shadow-sm"
        aria-hidden
      >
        {getInitials(user.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white truncate">{user.name}</p>
        <p className="text-sm text-slate-400 truncate">{user.email}</p>
        {user.role && (
          <p className="text-xs text-slate-500 mt-1">{user.role}</p>
        )}
      </div>
    </div>
  )
}
