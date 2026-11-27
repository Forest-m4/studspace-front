import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Modal({ title, onClose, children, busy = false }: { title: string; onClose: () => void; children: ReactNode; busy?: boolean }) {
  const titleId = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const closingAnimation = useRef<Animation | null>(null)
  useEffect(() => {
    const node = dialog.current
    const previous = document.activeElement
    node?.showModal()
    return () => {
      closingAnimation.current?.cancel()
      closingAnimation.current = null
      node?.close()
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])
  const requestClose = () => {
    const node = dialog.current
    if (busy || closingAnimation.current) return
    if (!node?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose()
      return
    }
    const current = getComputedStyle(node)
    node.dataset.closing = 'true'
    node.inert = true
    const animation = node.animate([
      { opacity: current.opacity, transform: current.transform },
      { opacity: 0, transform: 'translateY(12px) scale(.98)' },
    ], { duration: 150, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' })
    closingAnimation.current = animation
    void animation.finished.then(onClose).catch(() => {})
  }
  return createPortal(<dialog ref={dialog} aria-labelledby={titleId} aria-busy={busy}
    onCancel={event => { event.preventDefault(); requestClose() }}
    onClick={event => { if (event.target === event.currentTarget) requestClose() }}
    className="app-dialog">
    <div className="rounded-3xl bg-white p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-[20px] font-bold leading-tight">{title}</h2>
        <button type="button" aria-label="Закрыть окно" disabled={busy} onClick={requestClose} className="icon-button shrink-0"><X size={18} /></button>
      </header>
      {children}
    </div>
  </dialog>, document.body)
}
