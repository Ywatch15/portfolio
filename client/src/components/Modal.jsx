import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null)
  const lastFocused = useRef(null)

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement
      dialogRef.current?.showModal?.()
      const firstButton = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      firstButton?.focus()
    } else {
      dialogRef.current?.close?.()
      lastFocused.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <dialog ref={dialogRef} className="open:block bg-neutral-900/95 text-neutral-100 backdrop:bg-black/50 p-0 rounded-lg w-[min(90vw,700px)] border border-neutral-700">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose} aria-label="Close modal" className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 focus-visible:outline outline-2 outline-offset-2 outline-indigo-500">Close</button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </dialog>
  )
}
