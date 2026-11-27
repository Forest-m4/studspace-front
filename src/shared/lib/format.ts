export const APP_TIME_ZONE = 'Europe/Moscow'
export function formatTime(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return '--:--'
  return new Intl.DateTimeFormat('ru-RU', { timeZone: APP_TIME_ZONE, hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}
export function formatDateLabel(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return ''
  const formatted = new Intl.DateTimeFormat('ru-RU', { timeZone: APP_TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
export function formatShortDateTime(start?: string, end?: string) {
  if (!start || !end) return '--:--'
  const day = new Intl.DateTimeFormat('ru-RU', { timeZone: APP_TIME_ZONE, weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(start))
  return day + ' · ' + formatTime(start) + '–' + formatTime(end)
}
export function toISODate(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const part = (type: string) => parts.find(p => p.type === type)?.value
  return part('year') + '-' + part('month') + '-' + part('day')
}
export function shiftDate(date: string, days: number) {
  const value = new Date(date + 'T12:00:00+03:00')
  value.setUTCDate(value.getUTCDate() + days)
  return toISODate(value)
}
export function weekRange(date: string) {
  const day = new Date(date + 'T12:00:00+03:00').getUTCDay()
  const from = shiftDate(date, -((day + 6) % 7))
  return { from, to: shiftDate(from, 6) }
}
export function moscowDateTime(date: string, time: string) { return date + 'T' + time + ':00+03:00' }
export function clockMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatCreatedAt(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return ''
  return new Intl.DateTimeFormat('ru-RU', { timeZone: APP_TIME_ZONE, day: 'numeric', month: 'short' }).format(new Date(value))
}
