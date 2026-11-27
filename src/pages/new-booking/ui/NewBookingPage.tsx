import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { bookingApi } from '@/entities/booking'
import type { NewBookingDraft } from '@/entities/booking-draft'
import type { MyBooking } from '@/entities/my-booking'
import { spaceApi } from '@/entities/space'
import { useSession } from '@/entities/user/model/session-context'
import { NewBookingForm } from '@/features/create-booking'
import { availabilityForReschedule, createBookingPayload, suggestBookingTimes, validateBookingDraft } from '@/features/create-booking/model/booking'
import { ApiRequestError, errorMessage } from '@/shared/api/errors'
import { routes } from '@/shared/config'
import { formatDateLabel, formatTime, toISODate } from '@/shared/lib/format'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { BookingDatePickerModal } from '@/widgets/booking-date-picker-modal'
export interface NewBookingPageProps { onClose?: () => void }
export function NewBookingPage({ onClose }: NewBookingPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { user } = useSession()
  const source = location.state?.booking as MyBooking | undefined
  const reschedule = location.state?.mode === 'reschedule' && Boolean(source?.bookingId)
  const [openedAt] = useState(() => new Date())
  const today = toISODate(openedAt)
  const [storedDraft, setDraft] = useState<NewBookingDraft>(() => {
    const candidate = params.get('date') || (source?.startsAt && toISODate(new Date(source.startsAt))) || today
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(candidate) && Number.isFinite(Date.parse(candidate + 'T12:00:00+03:00')) && toISODate(new Date(candidate + 'T12:00:00+03:00')) === candidate
    return { spaceId: Number(params.get('spaceId')) || source?.spaceId || 0, fullName: [user.first_name, user.last_name].filter(Boolean).join(' '),
      dateISO: validDate && candidate >= today ? candidate : today, dateLabel: '', fromTime: params.get('from') || (source?.startsAt ? formatTime(source.startsAt) : ''), toTime: params.get('to') || (source?.endsAt ? formatTime(source.endsAt) : ''),
      eventTitle: source?.title || '', purpose: source?.purpose || '', peopleCount: source?.peopleCount || 1, peopleLimit: 0 }
  })
  const spaces = useAsyncData(() => spaceApi.getSpaces(), 'spaces')
  const selected = spaces.data?.find(space => space.space_id === storedDraft.spaceId) ?? spaces.data?.[0]
  const spaceId = selected?.space_id ?? 0
  const capacity = selected?.capacity ?? 0
  const availability = useAsyncData(async () => spaceId ? spaceApi.getSpaceAvailability(spaceId, storedDraft.dateISO) : undefined, spaceId + ':' + storedDraft.dateISO)
  const data = availability.data && reschedule ? availabilityForReschedule(availability.data, source!) : availability.data
  const suggestion = data ? suggestBookingTimes(data, openedAt) : undefined
  const draft: NewBookingDraft = { ...storedDraft, spaceId, peopleLimit: capacity,
    peopleCount: reschedule ? storedDraft.peopleCount : Math.min(storedDraft.peopleCount, capacity),
    dateLabel: formatDateLabel(storedDraft.dateISO + 'T12:00:00+03:00'),
    ...(!storedDraft.fromTime && !storedDraft.toTime && suggestion ? suggestion : {}) }
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const close = () => { if (!busy) { if (onClose) onClose(); else navigate(routes.bookings) } }
  const submit = async () => {
    if (busy || !availability.data || availability.loading || availability.error) return
    const errors = validateBookingDraft(draft, data)
    setFields(errors); setError('')
    if (Object.keys(errors).length) return
    setBusy(true)
    try {
      const payload = createBookingPayload(draft)
      if (reschedule) await bookingApi.rescheduleBooking(source!.bookingId!, { space_id: payload.space_id, starts_at: payload.starts_at, ends_at: payload.ends_at })
      else await bookingApi.createBooking(payload)
      navigate(routes.bookings, { replace: true, state: { notice: reschedule ? 'Заявка на перенос отправлена. Прежняя бронь действует до одобрения.' : 'Заявка отправлена на рассмотрение.' } })
    } catch (reason) {
      setError(errorMessage(reason))
      if (reason instanceof ApiRequestError) { setFields(reason.fields); if (reason.code === 'SLOT_CONFLICT') availability.reload() }
    } finally { setBusy(false) }
  }
  if (spaces.loading) return <main className="page-shell"><LoadingState label="Загружаем помещения…" /></main>
  if (spaces.error) return <main className="page-shell"><ErrorState message={spaces.error} onRetry={spaces.reload} /><button className="secondary-action mt-4" onClick={close}>Назад к заявкам</button></main>
  if (!spaces.data?.length) return <main className="page-shell"><EmptyState title="Нет доступных помещений" text="Попробуйте позже." /><button onClick={close} className="secondary-action mt-4">Назад к заявкам</button></main>
  const summary = availability.loading ? 'Проверяем доступность…' : data ? 'Рабочие часы: ' + data.open_time?.slice(0, 5) + '–' + data.close_time?.slice(0, 5) + '. Шаг ' + data.slot_step_min + ' мин. Время московское.' + (data.busy?.length ? ' Занято: ' + data.busy.map(slot => formatTime(slot.starts_at) + '–' + formatTime(slot.ends_at)).join(', ') : ' Занятых интервалов нет.') : ''
  return <>
    <NewBookingForm spaceOptions={spaces.data.map((space, index) => ({ id: space.space_id!, name: space.name ?? '', capacityLabel: 'до ' + space.capacity + ' чел.', color: index === 0 ? 'violet' : 'lime' }))}
      draft={draft} onChange={next => { setDraft(next); setFields({}); setError('') }} onOpenDatePicker={() => setDatePickerOpen(true)}
      onSubmit={() => { void submit() }} onClose={close} busy={busy} unavailable={availability.loading || Boolean(availability.error) || !data}
      fields={fields} error={error} availabilityText={summary} stepMinutes={data?.slot_step_min} reschedule={reschedule} />
    {availability.error && <div className="page-shell pt-0"><ErrorState message={availability.error} onRetry={availability.reload} /></div>}
    {datePickerOpen && <BookingDatePickerModal selectedDateISO={draft.dateISO} minDateISO={today} onClose={() => setDatePickerOpen(false)}
      onSelect={dateISO => { setDraft(previous => ({ ...previous, dateISO, fromTime: '', toTime: '' })); setFields({}); setDatePickerOpen(false) }} />}
  </>
}
