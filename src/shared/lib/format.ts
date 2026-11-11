export function formatTime(value?: string) {
  if (!value) return '--:--'
  return new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateLabel(value?: string) {
  if (!value) return ''
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(value))

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatShortDateTime(start?: string, end?: string) {
  if (!start || !end) return '--:--'
  const day = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(start))
  return `${day} · ${formatTime(start)}-${formatTime(end)}`
}

export function toISODate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
