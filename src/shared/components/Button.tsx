import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 shadow-sm hover:shadow-card',
    secondary:
      'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-800 border border-slate-600',
    danger:
      'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm',
  }
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
