import { useLocation } from 'react-router-dom'
import { useUsers } from '../hooks'
import { UserCard } from '../components/UserCard'
import { UserCardSkeleton } from '../components/UserCardSkeleton'
import type { User } from '../types'

type SearchState = { searchEmail?: string; searchUser?: User | null }

export function UsersListPage() {
  const location = useLocation()
  const searchState = location.state as SearchState | null
  const searchEmail = searchState?.searchEmail
  const searchUser = searchState?.searchUser

  const { data: users = [], isLoading, error } = useUsers()

  if (searchEmail !== undefined) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Busca por e-mail</h1>
        <p className="text-slate-400 text-sm mb-8">E-mail: {searchEmail}</p>
        {searchUser ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl">
            <UserCard
              key={searchUser.id ?? (searchUser as { _id?: string })._id}
              user={{
                ...searchUser,
                id: searchUser.id ?? String((searchUser as { _id?: string })._id ?? ''),
              }}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-12 text-center text-slate-400 shadow-card">
            Nenhum usuário encontrado com esse e-mail.
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-36 rounded-xl bg-slate-700/80 animate-pulse mb-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div
          className="rounded-2xl border border-red-500/50 bg-red-950/30 p-5 text-red-400 shadow-card"
          role="alert"
        >
          {(error as { message?: string }).message ?? 'Erro ao carregar usuários.'}
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-12 text-center text-slate-400 shadow-card">
          Nenhum usuário cadastrado.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-8">Usuários</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
