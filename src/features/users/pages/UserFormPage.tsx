import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser, useCreateUser, useUpdateUser } from '../hooks'
import { useToast } from '@/shared/components'
import type { NewUser, UpdateUser } from '../types'

const createSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

const updateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
})

type CreateForm = z.infer<typeof createSchema>
type UpdateForm = z.infer<typeof updateSchema>

export function UserFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { data: user, isLoading: loadingUser } = useUser(id)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const toast = useToast()

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: { name: '', email: '' },
  })

  useEffect(() => {
    if (user) updateForm.reset({ name: user.name, email: user.email })
  }, [user, updateForm])

  const onCreate = async (data: CreateForm) => {
    setSubmitError(null)
    try {
      const payload: NewUser = { name: data.name, email: data.email, password: data.password }
      await createUser.mutateAsync(payload)
      toast.success('Usuário criado com sucesso.')
      navigate('/users', { replace: true })
    } catch (err) {
      setSubmitError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Erro ao criar usuário.')
    }
  }

  const onUpdate = async (data: UpdateForm) => {
    if (!id) return
    setSubmitError(null)
    try {
      const payload: UpdateUser = { name: data.name, email: data.email }
      await updateUser.mutateAsync({ id, data: payload })
      toast.success('Usuário atualizado com sucesso.')
      navigate('/users', { replace: true })
    } catch (err) {
      setSubmitError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Erro ao atualizar usuário.')
    }
  }

  if (isEdit && loadingUser) {
    return (
      <div className="p-6 flex items-center justify-center text-slate-400">
        Carregando...
      </div>
    )
  }

  if (isEdit && !user) {
    return (
      <div className="p-6">
        <p className="text-red-400">Usuário não encontrado.</p>
        <Link to="/users" className="text-sky-400 hover:underline mt-2 inline-block">Voltar à lista</Link>
      </div>
    )
  }

  if (isEdit) {
    return (
      <div className="p-6 max-w-lg">
        <header className="flex items-center gap-4 mb-6">
          <Link to={user ? `/users/${user.id}` : '/users'} className="text-slate-400 hover:text-white">← Voltar</Link>
          <div>
            <h1 className="text-2xl font-semibold text-white">Atualizar usuário</h1>
            {user && <p className="text-slate-400 text-sm mt-0.5">{user.name}</p>}
          </div>
        </header>
        <form onSubmit={updateForm.handleSubmit(onUpdate)} className="rounded-xl border border-slate-700 bg-slate-800 p-6 space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
            <input id="edit-name" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" aria-invalid={Boolean(updateForm.formState.errors.name)} {...updateForm.register('name')} />
            {updateForm.formState.errors.name && <p className="mt-1 text-sm text-red-400">{updateForm.formState.errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
            <input id="edit-email" type="email" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" aria-invalid={Boolean(updateForm.formState.errors.email)} {...updateForm.register('email')} />
            {updateForm.formState.errors.email && <p className="mt-1 text-sm text-red-400">{updateForm.formState.errors.email.message}</p>}
          </div>
          {submitError && <p className="text-sm text-red-400" role="alert">{submitError}</p>}
          <button type="submit" disabled={updateUser.isPending} className="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-50">
            {updateUser.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg">
      <header className="flex items-center gap-4 mb-6">
        <Link to="/users" className="text-slate-400 hover:text-white">← Voltar</Link>
        <div>
          <h1 className="text-2xl font-semibold text-white">Criar usuário</h1>
          <p className="text-slate-400 text-sm mt-0.5">Preencha os dados para cadastrar um novo usuário.</p>
        </div>
      </header>
      <form onSubmit={createForm.handleSubmit(onCreate)} className="rounded-xl border border-slate-700 bg-slate-800 p-6 space-y-4">
        <div>
          <label htmlFor="new-name" className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
          <input id="new-name" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" aria-invalid={Boolean(createForm.formState.errors.name)} {...createForm.register('name')} />
          {createForm.formState.errors.name && <p className="mt-1 text-sm text-red-400">{createForm.formState.errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="new-email" className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
          <input id="new-email" type="email" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" aria-invalid={Boolean(createForm.formState.errors.email)} {...createForm.register('email')} />
          {createForm.formState.errors.email && <p className="mt-1 text-sm text-red-400">{createForm.formState.errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
          <input id="new-password" type="password" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" aria-invalid={Boolean(createForm.formState.errors.password)} {...createForm.register('password')} />
          {createForm.formState.errors.password && <p className="mt-1 text-sm text-red-400">{createForm.formState.errors.password.message}</p>}
        </div>
        {submitError && <p className="text-sm text-red-400" role="alert">{submitError}</p>}
        <button type="submit" disabled={createUser.isPending} className="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-50">
          {createUser.isPending ? 'Criando...' : 'Criar usuário'}
        </button>
      </form>
    </div>
  )
}
