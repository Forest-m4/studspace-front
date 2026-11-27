import type { NewBookingDraft } from '@/entities/booking-draft'
import type { components } from '@/shared/api/schema'
import { clockMinutes, moscowDateTime, formatTime, toISODate } from '@/shared/lib/format'

type Availability = components['schemas']['api.SpaceAvailability']
export function includeScheduleBusy(availability: Availability, items: components['schemas']['api.ScheduleItem'][], excludedBookingId?: number): Availability {
  const busy = [...(availability.busy ?? []), ...items.filter(item =>
    item.space_id === availability.space_id && (excludedBookingId === undefined || item.booking_id !== excludedBookingId) &&
    (item.status === 'pending' || item.status === 'approved') && item.starts_at && toISODate(new Date(item.starts_at)) === availability.date)
    .map(item => ({ starts_at: item.starts_at, ends_at: item.ends_at }))]
  const unique = new Map(busy.map(slot => [Date.parse(slot.starts_at ?? '') + ':' + Date.parse(slot.ends_at ?? ''), slot]))
  return { ...availability, busy: [...unique.values()].sort((a, b) => Date.parse(a.starts_at ?? '') - Date.parse(b.starts_at ?? '')) }
}
export function createBookingPayload(draft: NewBookingDraft) {
  return { space_id: draft.spaceId, first_name: draft.firstName.trim(), last_name: draft.lastName.trim(), title: draft.eventTitle.trim(), purpose: draft.purpose.trim(),
    people_count: draft.peopleCount, starts_at: moscowDateTime(draft.dateISO, draft.fromTime), ends_at: moscowDateTime(draft.dateISO, draft.toTime) }
}
export function validateBookingDraft(draft: NewBookingDraft, availability?: Availability, now = new Date()) {
  const errors: Record<string, string> = {}
  const payload = createBookingPayload(draft)
  if ([...payload.first_name].length < 1 || [...payload.first_name].length > 100) errors.first_name = 'Имя: от 1 до 100 символов'
  if ([...payload.last_name].length < 1 || [...payload.last_name].length > 100) errors.last_name = 'Фамилия: от 1 до 100 символов'
  if (!draft.spaceId) errors.space_id = 'Выберите помещение'
  if ([...payload.title].length < 1 || [...payload.title].length > 150) errors.title = 'Название: от 1 до 150 символов'
  if ([...payload.purpose].length < 1 || [...payload.purpose].length > 150) errors.purpose = 'Цель: от 1 до 150 символов'
  if (!Number.isInteger(draft.peopleCount) || draft.peopleCount < 1 || draft.peopleCount > draft.peopleLimit) errors.people_count = 'Укажите от 1 до ' + draft.peopleLimit + ' человек'
  const start = Date.parse(payload.starts_at), end = Date.parse(payload.ends_at)
  if (!Number.isFinite(start) || start <= now.getTime()) errors.starts_at = 'Начало должно быть в будущем'
  if (!Number.isFinite(end) || end <= start) errors.ends_at = 'Окончание должно быть позже начала'
  if (availability && availability.date === draft.dateISO && availability.space_id === draft.spaceId) {
    const from = clockMinutes(draft.fromTime), to = clockMinutes(draft.toTime)
    const open = clockMinutes(availability.open_time ?? '00:00'), close = clockMinutes(availability.close_time ?? '23:59')
    const step = availability.slot_step_min ?? 0
    if (from < open || from >= close) errors.starts_at = 'Начало вне рабочих часов'
    else if (step > 0 && (from - open) % step !== 0) errors.starts_at = 'Шаг времени — ' + step + ' мин.'
    if (to <= open || to > close) errors.ends_at = 'Окончание вне рабочих часов'
    else if (step > 0 && to !== close && (to - open) % step !== 0) errors.ends_at = 'Шаг времени — ' + step + ' мин.'
    if (availability.busy?.some(slot => start < Date.parse(slot.ends_at ?? '') && end > Date.parse(slot.starts_at ?? ''))) errors.starts_at = 'Выбранное время уже занято'
  }
  return errors
}

export function suggestBookingTimes(availability: Availability, now: Date) {
  const date = availability.date
  if (!date || date < toISODate(now)) return undefined
  const open = clockMinutes(availability.open_time || '09:00')
  const close = clockMinutes(availability.close_time || '22:00')
  const step = availability.slot_step_min || 30
  const earliest = date === toISODate(now) ? Math.max(open, clockMinutes(formatTime(now.toISOString())) + 1) : open
  const clock = (minutes: number) => String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0')
  for (let start = open + Math.ceil((earliest - open) / step) * step; start + step <= close; start += step) {
    const fromTime = clock(start), toTime = clock(start + step)
    const from = Date.parse(moscowDateTime(date, fromTime)), to = Date.parse(moscowDateTime(date, toTime))
    if (!availability.busy?.some(slot => from < Date.parse(slot.ends_at!) && to > Date.parse(slot.starts_at!))) return { fromTime, toTime }
  }
  return undefined
}

// Availability contains individual approved intervals, without booking IDs.
// Exclude only the exact source slot, preserving every other conflict.
export function availabilityForReschedule(availability: Availability, original: { spaceId?: number; startsAt?: string; endsAt?: string }) {
  if (availability.space_id !== original.spaceId) return availability
  return { ...availability, busy: availability.busy?.filter(slot =>
    Date.parse(slot.starts_at ?? '') !== Date.parse(original.startsAt ?? '') || Date.parse(slot.ends_at ?? '') !== Date.parse(original.endsAt ?? '')) }
}
