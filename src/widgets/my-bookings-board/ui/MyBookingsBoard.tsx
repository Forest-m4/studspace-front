import { useState } from 'react'
import { CalendarPlus2, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { bookingApi } from '@/entities/booking'
import type { MyBooking, MyBookingTab } from '@/entities/my-booking'
import { mapApiBookingsToMyBookings } from '@/shared/api/adapters'
import { errorMessage } from '@/shared/api/errors'
import { routes } from '@/shared/config'
import { formatDateLabel, formatTime } from '@/shared/lib/format'
import { bookingStatusClass, bookingStatusLabel } from '@/shared/lib/booking-status'
import { usePagedData } from '@/shared/lib/usePagedData'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { Modal } from '@/shared/ui/modal/Modal'
export interface MyBookingsBoardProps { onCreateBooking: () => void }
export function MyBookingsBoard({ onCreateBooking }: MyBookingsBoardProps) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<MyBookingTab>('active')
  const list = usePagedData(cursor => bookingApi.getMyBookings(tab, cursor), tab)
  const items = mapApiBookingsToMyBookings(list.items, tab)
  const [target, setTarget] = useState<{ booking: MyBooking; action: 'cancel' | 'withdraw' }>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const confirm = async () => {
    if (!target?.booking.bookingId || busy) return
    setBusy(true); setError('')
    try {
      if (target.action === 'withdraw') await bookingApi.withdrawBooking(target.booking.bookingId)
      else await bookingApi.cancelBooking(target.booking.bookingId)
      setTarget(undefined); setNotice(target.action === 'withdraw' ? 'Заявка отозвана.' : 'Бронь отменена.'); list.reload()
    } catch (reason) { setError(errorMessage(reason)) }
    finally { setBusy(false) }
  }
  return <section className="flex flex-col gap-3">
    <div className="tab-list w-full">{(['active','history'] as const).map(value => <button key={value} aria-pressed={tab === value} className={tab === value ? 'active' : ''} onClick={() => { setTab(value); setError(''); setNotice('') }}>{value === 'active' ? 'Активные' : 'История'}</button>)}</div>
    {notice && <p role="status" className="success-message">{notice}</p>}
    {error && !target && <ErrorState message={error} />}
    {list.loading ? <LoadingState /> : list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !items.length ? tab === 'active' ?
      <div className="mt-10 flex flex-col items-center rounded-3xl bg-white p-6 text-center"><span className="flex size-20 items-center justify-center rounded-full bg-[#eeedfc] text-brand-primary"><CalendarPlus2 size={32} /></span><h2 className="mt-4 text-[20px] font-bold">Заявок пока нет</h2><p className="mt-2 text-[15px] text-brand-muted">Забронируйте пространство — заявка появится здесь</p><button className="primary-action mt-5 px-6" onClick={onCreateBooking}>+ Новая заявка</button></div>
      : <EmptyState title="История пока пуста" text="Завершённые и отклонённые заявки появятся здесь." />
      : items.map(booking => <article key={booking.id} className="overflow-hidden rounded-3xl bg-white">
        <div className="border-l-3 border-brand-primary p-4"><div className="flex items-center justify-between gap-2"><span className={'rounded-full px-2 py-1 text-[12px] ' + bookingStatusClass(booking.status)}>{bookingStatusLabel(booking.status, booking.cancelledBy)}</span><span className="text-[12px] text-brand-muted">{booking.createdAtLabel}</span></div>
          {tab === 'active' ? <div className="mt-3"><p className="text-[22px] font-bold">{formatTime(booking.startsAt)}–{formatTime(booking.endsAt)}</p><p className="mt-1 text-[14px] text-brand-muted">{formatDateLabel(booking.startsAt)}</p></div> : <p className="mt-3 text-[16px] font-semibold">{booking.dateTimeLabel}</p>}
          <p className="mt-2 text-[15px]">{booking.spaceAndPeople}</p>{booking.title && <p className="mt-1 text-[15px] font-semibold">{booking.title}</p>}<p className="mt-1 text-[14px] text-brand-muted">{booking.purpose}</p>
          {booking.rejectReason && <p className="mt-3 rounded-xl bg-[#fff0f2] p-3 text-[13px] text-[#9a3548]">{booking.rejectReason}</p>}
        </div>
        {(booking.actions?.length ?? 0) > 0 && <div className="flex flex-wrap gap-4 border-t border-brand-border px-4 py-3 text-[15px]">
          {booking.actions?.includes('withdraw') && <button className="text-brand-muted" disabled={busy} onClick={() => { setError(''); setTarget({ booking, action: 'withdraw' }) }}>Отозвать заявку</button>}
          {booking.actions?.includes('reschedule') && <button className="text-brand-primary" disabled={busy} onClick={() => navigate(routes.newBooking, { state: { booking, mode: 'reschedule' } })}>Перенести</button>}
          {booking.actions?.includes('cancel') && <button className="text-[#bd3f56]" disabled={busy} onClick={() => { setError(''); setTarget({ booking, action: 'cancel' }) }}>Отменить</button>}
          {booking.actions?.includes('rebook') && <button className="text-brand-primary" onClick={() => navigate(routes.newBooking, { state: { booking, mode: 'rebook' } })}>Забронировать снова</button>}
        </div>}
      </article>)}
    {list.moreError && <ErrorState message={list.moreError} onRetry={() => { void list.loadMore() }} />}
    {list.cursor && <button className="secondary-action" disabled={list.more} onClick={() => { void list.loadMore() }}>{list.more ? 'Загружаем…' : 'Показать ещё'}</button>}
    {tab === 'active' && items.length > 0 && <button aria-label="Новая заявка" onClick={onCreateBooking} className="floating-action bg-brand-accent! text-brand-dark!"><Plus size={22} /></button>}
    {target && <Modal title={target.action === 'withdraw' ? 'Отозвать заявку?' : 'Отменить бронь?'} onClose={() => setTarget(undefined)} busy={busy}>
      <p className="mb-4 text-[14px] text-brand-muted">{target.booking.dateTimeLabel} · {target.booking.spaceAndPeople}</p>
      {error && <ErrorState message={error} />}
      <div className="mt-4 grid grid-cols-2 gap-3"><button className="secondary-action" disabled={busy} onClick={() => setTarget(undefined)}>Оставить</button><button className="danger-action" disabled={busy} onClick={() => { void confirm() }}>{busy ? 'Отправляем…' : target.action === 'withdraw' ? 'Отозвать' : 'Отменить бронь'}</button></div>
    </Modal>}
  </section>
}
