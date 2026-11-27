import { useState } from 'react'
import type { BookingRequest } from '@/entities/booking-request'
import { ErrorState } from '@/shared/ui/async-state/AsyncState'
import { Modal } from '@/shared/ui/modal/Modal'
export interface RejectRequestModalProps { request: BookingRequest; onClose: () => void; onSubmit: (reason: string, title?: string) => void; busy?: boolean; error?: string }
export function RejectRequestModal({ request, onClose, onSubmit, busy, error }: RejectRequestModalProps) {
  const [reason, setReason] = useState('')
  const [title, setTitle] = useState('')
  const [invalid, setInvalid] = useState(false)
  return <Modal title="Отклонить заявку" onClose={onClose} busy={busy}>
    <div className="mb-4 rounded-2xl bg-[#f4f4f8] p-3"><p className="mb-2 break-words text-[16px] font-semibold">{request.title?.trim() || 'Без названия'}</p><p className="text-[14px]">{request.lastName} {request.firstName}</p><p className="mt-1 text-[13px] text-brand-muted">{request.dateLabel} · {request.fromTime}–{request.toTime} · {request.spaceName}</p></div>
    <form onSubmit={event => { event.preventDefault(); if (!reason.trim()) { setInvalid(true); return } onSubmit(reason.trim(), title.trim() || undefined) }}>
      <label className="field-label">Краткая причина <span className="text-brand-muted">(необязательно)</span><input className="field-input mt-2 mb-4" maxLength={150} disabled={busy} value={title} onChange={event => setTitle(event.target.value)} /></label>
      <label className="field-label">Причина отказа<textarea autoFocus required maxLength={300} disabled={busy} className="field-input mt-2 min-h-28 py-3" value={reason} onChange={event => { setReason(event.target.value); setInvalid(false) }} /></label>
      <p className="mt-1 text-right text-[12px] text-brand-muted">{[...reason].length} / 300</p><p className="mt-2 text-[13px] text-brand-muted">Студент увидит эту причину в своих заявках.</p>
      {invalid && <p role="alert" className="field-error">Укажите причину отказа.</p>}{error && <div className="mt-3"><ErrorState message={error} /></div>}
      <div className="mt-4 grid grid-cols-2 gap-3"><button type="button" className="secondary-action" disabled={busy} onClick={onClose}>Отмена</button><button type="submit" disabled={busy || !reason.trim()} className="danger-action">{busy ? 'Отправляем…' : 'Отправить'}</button></div>
    </form>
  </Modal>
}
