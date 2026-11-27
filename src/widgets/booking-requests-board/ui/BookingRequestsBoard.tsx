import { useState } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import { bookingApi } from '@/entities/booking'
import type { BookingRequest, RequestTab } from '@/entities/booking-request'
import { spaceApi } from '@/entities/space'
import { RejectRequestModal } from '@/features/reject-booking'
import { mapApiAdminBookingToRequest } from '@/shared/api/adapters'
import { errorMessage } from '@/shared/api/errors'
import { bookingStatusClass, bookingStatusLabel } from '@/shared/lib/booking-status'
import { usePagedData } from '@/shared/lib/usePagedData'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { Modal } from '@/shared/ui/modal/Modal'
function Field({ label, value }: { label: string; value: string | number }) { return <div><p className="mb-1 text-[13px] text-brand-muted">{label}</p><p className="rounded-xl bg-[#f4f4f8] px-3 py-2 text-[15px]">{value}</p></div> }
type Decision = 'approve' | 'reject' | 'cancel' | 'return'
export function BookingRequestsBoard() {
  const [tab, setTab] = useState<RequestTab>('new')
  const list = usePagedData(cursor => bookingApi.getAdminBookings(tab, cursor), tab)
  const spaces = useAsyncData(() => spaceApi.getSpaces(), 'admin-spaces')
  const requests = list.items.map(item => mapApiAdminBookingToRequest(item, spaces.data))
  const [target, setTarget] = useState<{ request: BookingRequest; action: Decision }>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const act = async (reason?: string, title?: string) => {
    if (!target?.request.bookingId || busy) return
    setBusy(true); setError('')
    try {
      const id = target.request.bookingId
      if (target.action === 'approve') await bookingApi.approveAdminBooking(id)
      else if (target.action === 'reject') await bookingApi.rejectAdminBooking(id, reason!, title)
      else if (target.action === 'cancel') await bookingApi.cancelAdminBooking(id)
      else await bookingApi.returnAdminBookingToReview(id)
      setTarget(undefined); setNotice('Изменения сохранены.'); list.reload()
    } catch (reason) { setError(errorMessage(reason)) }
    finally { setBusy(false) }
  }
  const open = (request: BookingRequest, action: Decision) => { setTarget({ request, action }); setError('') }
  return <section className="flex flex-col gap-3">
    <div className="tab-list w-full">{([{ key: 'new', name: 'Новые' }, { key: 'approved', name: 'Одобренные' }, { key: 'rejected', name: 'Отклонённые' }] as const).map(item => <button key={item.key} className={tab === item.key ? 'active' : ''} aria-pressed={tab === item.key} onClick={() => { setTab(item.key); setNotice('') }}>{item.name}{item.key === 'new' && list.newCount !== undefined ? ' ' + list.newCount : ''}</button>)}</div>
    {notice && <p role="status" className="success-message">{notice}</p>}
    {spaces.error && <ErrorState message="Не удалось загрузить вместимость помещений." onRetry={spaces.reload} />}
    {list.loading ? <LoadingState /> : list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : !requests.length ? <EmptyState title="Заявок в этой вкладке нет" /> :
      requests.map(request => <article key={request.id} className="rounded-3xl bg-white p-4">
        <header className="flex items-start gap-2"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eeedfc] text-[14px] font-semibold text-brand-primary">{request.applicantInitials}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className={'rounded-full px-2 py-1 text-[12px] ' + bookingStatusClass(request.bookingStatus)}>{bookingStatusLabel(request.bookingStatus)}</span><span className="text-[12px] text-brand-muted">{request.createdAtLabel}</span></div>{request.vkUserId && <a href={'https://vk.com/id' + request.vkUserId} target="_blank" rel="noreferrer" className="text-[13px] text-brand-primary">Профиль ВК ↗</a>}</div></header>
        <div className="mt-4 flex flex-col gap-3"><Field label="Помещение" value={request.spaceName + (request.capacityLabel ? ' · ' + request.capacityLabel : '')} />
          <div className="grid grid-cols-2 gap-3"><Field label="Фамилия" value={request.lastName} /><Field label="Имя" value={request.firstName} /></div>
          <Field label="Дата" value={request.dateLabel} /><div className="grid grid-cols-2 gap-3"><Field label="С" value={request.fromTime} /><Field label="До" value={request.toTime} /></div>
          <Field label="Для чего" value={request.purpose} /><Field label="Сколько человек" value={request.peopleCount + (request.peopleLimit ? ' из ' + request.peopleLimit : '')} />
          {request.warningText && <p className="flex gap-2 whitespace-pre-line rounded-xl bg-[#fff7e8] p-3 text-[13px] text-[#99621b]"><AlertTriangle size={17} className="shrink-0" />{request.warningText}</p>}
          {request.decisionReason && <div className="rounded-xl bg-[#fff0f2] p-3 text-[13px] text-[#9a3548]"><p className="mb-1 font-semibold">{request.decisionReasonTitle || 'Причина отказа'}</p><p>{request.decisionReason}</p></div>}
          {request.decisionMeta && <p className="border-t border-brand-border pt-2 text-[12px] text-brand-muted">{request.decisionMeta}</p>}
          {request.bookingStatus === 'pending' && <div className="grid grid-cols-2 gap-3"><button className="secondary-action text-[#bd3f56]!" disabled={busy} onClick={() => open(request, 'reject')}>Отклонить</button><button className="primary-action flex items-center justify-center gap-1 bg-brand-primary! text-white!" disabled={busy} onClick={() => open(request, 'approve')}><Check size={17} />Одобрить</button></div>}
          {request.bookingStatus === 'approved' && <button disabled={busy} className="secondary-action text-[#bd3f56]!" onClick={() => open(request, 'cancel')}>Отменить бронь</button>}
          {request.bookingStatus === 'rejected' && <button disabled={busy} className="secondary-action text-brand-primary!" onClick={() => open(request, 'return')}>Вернуть на рассмотрение</button>}
        </div>
      </article>)}
    {list.moreError && <ErrorState message={list.moreError} onRetry={() => { void list.loadMore() }} />}
    {list.cursor && <button className="secondary-action" disabled={list.more} onClick={() => { void list.loadMore() }}>{list.more ? 'Загружаем…' : 'Показать ещё'}</button>}
    {target?.action === 'reject' ? <RejectRequestModal request={target.request} busy={busy} error={error} onClose={() => setTarget(undefined)} onSubmit={(reason, title) => { void act(reason, title) }} /> :
      target && <Modal title={target.action === 'approve' ? 'Одобрить заявку?' : target.action === 'cancel' ? 'Отменить бронь?' : 'Вернуть на рассмотрение?'} busy={busy} onClose={() => setTarget(undefined)}>
        <p className="text-[14px] text-brand-muted">{target.request.lastName} {target.request.firstName} · {target.request.dateLabel}, {target.request.fromTime}–{target.request.toTime}</p>
        {target.request.warningText && <p className="mt-3 rounded-xl bg-[#fff7e8] p-3 text-[13px]">{target.request.warningText}</p>}
        {error && <div className="mt-3"><ErrorState message={error} /></div>}
        <div className="mt-4 grid grid-cols-2 gap-3"><button disabled={busy} className="secondary-action" onClick={() => setTarget(undefined)}>Назад</button><button disabled={busy} className="primary-action" onClick={() => { void act() }}>{busy ? 'Сохраняем…' : 'Подтвердить'}</button></div>
      </Modal>}
  </section>
}
