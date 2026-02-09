export interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export function Spinner({ className = '', size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`rounded-full border-slate-600 border-t-indigo-500 animate-spin ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Carregando"
    />
  )
}
