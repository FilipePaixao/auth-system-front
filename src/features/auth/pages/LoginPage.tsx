import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks'
import { useToast } from '@/shared/components'
import { Button } from '@/shared/components'

const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/app/users'

  useEffect(() => {
    if (token) navigate(from, { replace: true })
  }, [token, from, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null)
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (err) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : err && typeof err === 'object' && 'response' in err
          ? String((err as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Falha ao entrar.')
          : 'Falha ao entrar. Tente novamente.'
      setSubmitError(message)
      toast.error(message)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-700/80 bg-slate-800/90 p-8 shadow-card-hover backdrop-blur-sm">
      <h1 className="text-2xl font-bold tracking-tight text-white">Entrar</h1>
      <p className="mt-1 text-sm text-slate-400">Use seu e-mail e senha para acessar.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition"
            placeholder="seu@email.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Senha
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>
        {submitError && (
          <p className="text-sm text-red-400" role="alert">{submitError}</p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl font-medium"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Não tem conta?{' '}
        <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
