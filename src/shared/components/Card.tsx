import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-slate-800 shadow-card p-6 transition hover:shadow-card-hover ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
