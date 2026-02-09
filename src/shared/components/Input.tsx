import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, id, className = '', ...props }, ref) {
    const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition ${className}`}
          {...props}
        />
      </div>
    )
  }
)
