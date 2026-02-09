import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsers, useDeleteUser } from '../hooks'
import { useAuth } from '@/features/auth/hooks'
import { useToast } from '@/shared/components'

function formatDateTime(value: string | undefined): string {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return '-'
  }
}

export function UserListPage() {
  const { data: users = [], isLoading, error } = useUsers()
  const deleteUser = useDeleteUser()
  const { logout } = useAuth()
  const toast = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return
    setDeleteId(id)
    try {
      await deleteUser.mutateAsync(id)
      toast.success('Usuário excluído com sucesso.')
    } catch {
      toast.error('Não foi possível excluir o usuário.')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-700 bg-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Usuários</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/users/new"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Criar usuário
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-slate-400">
            Carregando usuários...
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-500 bg-red-950/30 p-4 text-red-400">
            {(error as { message?: string }).message ?? 'Erro ao carregar usuários.'}
          </div>
        )}
        {!isLoading && !error && users.length === 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-400">
            Nenhum usuário cadastrado.{' '}
            <Link to="/users/new" className="text-sky-400 hover:underline">
              Criar primeiro usuário
            </Link>
          </div>
        )}
        {!isLoading && !error && users.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">Nome</th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">E-mail</th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300">Criado em</th>
                  <th className="px-4 py-3 text-sm font-medium text-slate-300 w-56">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700 last:border-0 hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-white">{user.name}</td>
                    <td className="px-4 py-3 text-slate-300">{user.email}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{formatDateTime(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/users/${user.id}`} className="text-sm text-slate-300 hover:text-white hover:underline">
                          Ver perfil
                        </Link>
                        <Link to={`/users/${user.id}/edit`} className="text-sm text-sky-400 hover:underline">
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteId === user.id}
                          className="text-sm text-red-400 hover:underline disabled:opacity-50"
                        >
                          {deleteId === user.id ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
