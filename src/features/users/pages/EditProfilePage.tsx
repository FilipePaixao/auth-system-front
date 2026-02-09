import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/features/auth/hooks'
import { useUser, useUpdateProfile, useDeleteAccount } from '../hooks'
import type { User } from '../types'
import { useToast } from '@/shared/components'
import { Button, Input, Card, Spinner } from '@/shared/components'

function PencilIcon({ className }: { className?: string }) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

const editProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(0).optional(),
}).refine(
  (data) => !data.password || data.password.length >= 6,
  { message: 'Senha deve ter no mínimo 6 caracteres', path: ['password'] }
)

type EditProfileForm = z.infer<typeof editProfileSchema>

export function EditProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const userId = user?.id ?? (user as { _id?: string })?._id
  const { data: profile, isLoading: loadingProfile } = useUser(userId)
  const updateProfile = useUpdateProfile()
  const deleteAccount = useDeleteAccount()
  const toast = useToast()

  const {
    register,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, email: profile.email, password: '' })
    }
  }, [profile, reset])

  useEffect(() => {
    if (isEditing && profile) {
      reset({ name: profile.name, email: profile.email, password: '' })
    }
  }, [isEditing, profile, reset])

  const submitProfile = async () => {
    try {
      if (!userId) {
        toast.error('Dados do perfil não disponíveis.')
        return
      }
      const displayUser = profile ?? user
      if (!displayUser) {
        toast.error('Dados do perfil não disponíveis.')
        return
      }
      const formValues = getValues()
      const name = (formValues.name?.trim() || displayUser.name).trim()
      const email = (formValues.email?.trim() || displayUser.email).trim()
      const password = formValues.password?.trim() || undefined
      if (!name || !email) {
        if (!name) setError('name', { message: 'Nome é obrigatório' })
        if (!email) setError('email', { message: 'E-mail é obrigatório' })
        return
      }
      const toValidate = { name, email, password: password ?? '' }
      const parsed = editProfileSchema.safeParse(toValidate)
      if (!parsed.success) {
        const err = parsed.error.flatten()
        if (err.fieldErrors.name) setError('name', { message: err.fieldErrors.name[0] })
        if (err.fieldErrors.email) setError('email', { message: err.fieldErrors.email[0] })
        if (err.fieldErrors.password) setError('password', { message: err.fieldErrors.password?.[0] })
        return
      }
      clearErrors()
      await updateProfile.mutateAsync({
        id: userId,
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          ...(parsed.data.password ? { password: parsed.data.password } : {}),
        },
      })
      toast.success('Perfil atualizado com sucesso.')
      setIsEditing(false)
    } catch {
      toast.error('Não foi possível atualizar o perfil.')
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) return
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'
    )
    if (!confirmed) return
    try {
      await deleteAccount.mutateAsync(userId)
      toast.success('Conta excluída com sucesso.')
      logout()
      navigate('/login', { replace: true })
    } catch {
      toast.error('Não foi possível excluir a conta.')
    }
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Faça login para editar seu perfil.</p>
      </div>
    )
  }

  if (loadingProfile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    )
  }

  const displayProfile = profile ?? user

  if (!isEditing) {
    return (
      <div className="p-8 max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Meu perfil</h1>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700/80 hover:text-white transition"
            aria-label="Editar perfil"
          >
            <PencilIcon className="w-5 h-5" />
            <span>Editar</span>
          </button>
        </div>
        <Card>
          <dl className="space-y-5">
            <div>
              <dt className="text-sm font-medium text-slate-400">Nome</dt>
              <dd className="mt-1 text-white font-medium">{displayProfile?.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">E-mail</dt>
              <dd className="mt-1 text-white font-medium">{displayProfile?.email ?? '—'}</dd>
            </div>
            {(displayProfile as User)?.role && (
              <div>
                <dt className="text-sm font-medium text-slate-400">Função</dt>
                <dd className="mt-1 text-white font-medium">{(displayProfile as User).role}</dd>
              </div>
            )}
            {displayProfile?.status && (
              <div>
                <dt className="text-sm font-medium text-slate-400">Status</dt>
                <dd className="mt-1 text-white font-medium">{displayProfile.status}</dd>
              </div>
            )}
          </dl>
          <div className="mt-8 pt-6 border-t border-slate-700/80 flex justify-end">
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleteAccount.isPending}
            >
              {deleteAccount.isPending ? 'Excluindo...' : 'Deletar conta'}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-8">Editar meu perfil</h1>
      <Card>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Nome"
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
          <Input
            label="E-mail"
            type="email"
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
          <Input
            label="Nova senha (opcional)"
            type="password"
            autoComplete="new-password"
            placeholder="Deixe em branco para não alterar"
            {...register('password')}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </form>
        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            onClick={() => void submitProfile()}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </Button>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-700/80 flex justify-end">
          <Button
            type="button"
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={deleteAccount.isPending}
          >
            {deleteAccount.isPending ? 'Excluindo...' : 'Deletar conta'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
