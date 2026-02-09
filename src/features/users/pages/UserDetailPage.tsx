import { Link, useParams, useNavigate } from 'react-router-dom'
import { useUser, useDeleteUser } from '../hooks'
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

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useUser(id)
  const deleteUser = useDeleteUser()
  const toast = useToast()

  const handleDelete = async () => {
    if (!id) return
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return
    try {
      await deleteUser.mutateAsync(id)
      toast.success('Usuário excluído com sucesso.')
      navigate('/users', { replace: true })
    } catch {
      toast.error('Não foi possível excluir o usuário.')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center text-slate-400">
        Carregando...
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <p className="text-red-400">Usuário não encontrado.</p>
        <Link to="/users" className="text-sky-400 hover:underline mt-2 inline-block">
          Voltar à lista
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg">
      <header className="flex items-center gap-4 mb-6">
        <Link to="/users" className="text-slate-400 hover:text-white">← Voltar</Link>
        <div>
          <h1 className="text-2xl font-semibold text-white">Perfil do usuário</h1>
          <p className="text-slate-400 text-sm mt-0.5">{user.name}</p>
        </div>
      </header>
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 space-y-4">
        <div>
          <span className="text-sm text-slate-400">ID</span>
          <p className="text-white font-mono text-sm">{user.id}</p>
        </div>
        <div>
          <span className="text-sm text-slate-400">Nome</span>
          <p className="text-white font-medium">{user.name}</p>
        </div>
        <div>
          <span className="text-sm text-slate-400">E-mail</span>
          <p className="text-white">{user.email}</p>
        </div>
        <div>
          <span className="text-sm text-slate-400">Criado em</span>
          <p className="text-slate-300">{formatDateTime(user.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
          <Link
            to={`/users/${user.id}/edit`}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Atualizar usuário
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteUser.isPending}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 disabled:opacity-50"
          >
            {deleteUser.isPending ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
