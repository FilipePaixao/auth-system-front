import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as authService from '../services/auth.service'
import { useToast } from '@/shared/components'
import { Button } from '@/shared/components'

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = async (data: RegisterForm) => {
    setSubmitError(null)
    try {
      await authService.register(data)
      toast.success('Conta criada com sucesso. Faça login.')
      navigate('/login', { replace: true })
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Erro ao criar conta.')
          : 'Erro ao criar conta.'
      setSubmitError(message)
      toast.error(message)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/90 p-8 shadow-card-hover backdrop-blur-sm">
      <h1 className="text-2xl font-bold tracking-tight text-white">Criar conta</h1>
      <p className="mt-1 text-sm text-slate-400">Preencha os dados para se cadastrar.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Nome
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-1.5">
            E-mail
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition"
            placeholder="seu@email.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Senha
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
        </div>
        {submitError && (
          <p className="text-sm text-red-400" role="alert">{submitError}</p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-xl font-medium">
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition">
          Entrar
        </Link>
      </p>
    </div>
  )
}
