import { useState, useCallback, type ReactNode } from 'react'
import { ToastContext, type ToastContextValue, type ToastVariant } from './ToastContext'

interface ToastMessage {
  id: number
  variant: ToastVariant
  message: string
}

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const show = useCallback((variant: ToastVariant, message: string) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, variant, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const value: ToastContextValue = {
    show,
    error: (msg) => show('error', msg),
    success: (msg) => show('success', msg),
    info: (msg) => show('info', msg),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg border p-4 text-sm ${
              t.variant === 'error'
                ? 'border-red-500 bg-red-950/30 text-red-400'
                : t.variant === 'success'
                  ? 'border-green-500 bg-green-950/30 text-green-400'
                  : 'border-sky-500 bg-sky-950/30 text-sky-300'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
