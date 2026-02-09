import type { ReactNode } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="rounded-xl border border-slate-700 bg-slate-800 shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-white mb-4">
              {title}
            </h2>
          )}
          {children}
        </div>
        <div className="border-t border-slate-700 p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
      <button
        type="button"
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Fechar modal"
      />
    </div>
  )
}
