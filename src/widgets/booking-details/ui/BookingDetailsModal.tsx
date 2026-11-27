import type { ReactNode } from 'react'
import type { components } from '@/shared/api/schema'
import { formatDateLabel, formatTime } from '@/shared/lib/format'
import { bookingStatusClass, bookingStatusLabel } from '@/shared/lib/booking-status'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { Modal } from '@/shared/ui/modal/Modal'

type BookingEntity = components['schemas']['api.Booking']
interface Props {
  booking: BookingEntity
  ownerName?: string
  loadDetails?: (signal: AbortSignal) => Promise<BookingEntity | undefined>
  onClose: () => void
}
function Detail({ label, children }: { label: string; children: ReactNode }) {
  return <div><dt className="mb-1 text-[12px] text-brand-muted">{label}</dt><dd className="break-words whitespace-pre-wrap text-[14px] font-medium">{children}</dd></div>
}
export function BookingDetailsModal({ booking, ownerName, loadDetails, onClose }: Props) {
  const state = useAsyncData(signal => loadDetails ? loadDetails(signal) : Promise.resolve(booking), String(booking.booking_id))
  const details = state.data ?? booking
  const full = !loadDetails || Boolean(state.data)
  const applicant = [details.first_name, details.last_name].filter(Boolean).join(' ') || ownerName
  return <Modal title={details.title || 'Сведения о заявке'} onClose={onClose}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <span className={'rounded-full px-3 py-1 text-[12px] ' + (details.status === 'pending' ? 'bg-[#fff5ca] text-[#805f12]' : bookingStatusClass(details.status))}>{bookingStatusLabel(details.status, details.cancelled_by)}</span>
      <span className="text-[12px] text-brand-muted">Заявка №{details.booking_id}</span>
    </div>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-[#f4f4f8] p-4">
      <div className="col-span-2"><Detail label="Помещение">{details.space?.name || 'Не указано'}</Detail></div>
      <div className="col-span-2"><Detail label="Дата">{formatDateLabel(details.starts_at)}</Detail></div>
      <Detail label="С">{formatTime(details.starts_at)}</Detail><Detail label="До">{formatTime(details.ends_at)}</Detail>
      {applicant && <div className="col-span-2"><Detail label="Заявитель">{applicant}</Detail></div>}
      {full && <><div className="col-span-2"><Detail label="Для чего">{details.purpose || 'Не указано'}</Detail></div>
        <Detail label="Количество человек">{details.people_count ?? 'Не указано'}</Detail>
        {details.created_at && <Detail label="Заявка создана">{formatDateLabel(details.created_at)}, {formatTime(details.created_at)}</Detail>}
        {details.reject_reason?.text && <div className="col-span-2"><Detail label={details.reject_reason.title || 'Причина отказа'}>{details.reject_reason.text}</Detail></div>}</>}
    </dl>
    {loadDetails && state.loading && <div className="mt-3"><LoadingState label="Загружаем сведения о заявке…" /></div>}
    {state.error && <div className="mt-3"><ErrorState message={state.error} onRetry={state.reload} /></div>}
    {loadDetails && !state.loading && !state.error && !state.data && <p className="mt-3 text-[13px] text-brand-muted">Подробные сведения этой заявки недоступны. Показаны данные из расписания.</p>}
  </Modal>
}
