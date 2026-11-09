import type { Booking } from '../model/types'

export interface BookingItemProps {
  item?: Booking
  booking?: Booking
  isLast?: boolean
  variant?: 'list' | 'grid'
}

export function BookingItem({ item, booking, isLast = false, variant = 'list' }: BookingItemProps) {
  const data = booking ?? item

  if (!data) {
    return null
  }

  const isEvent = data.type === 'event'
  const isCompleted = data.type === 'booking' && data.status === 'completed'

  const bgClass = isEvent
    ? 'bg-purple-100 border-purple-300'
    : isCompleted
      ? 'bg-indigo-50 border-indigo-200 opacity-70'
      : 'bg-[#f4f7d4] border-[#e2e8a0]'

  const formatTime = (isoString?: string) => {
    if (!isoString) {
      return '--:--'
    }

    const date = new Date(isoString)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const time = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`
  const person = data.type === 'booking' ? data.ownerName : data.organizer

  if (variant === 'grid') {
    return (
      <div className={`absolute w-full rounded-md border-l-4 p-2 text-xs flex flex-col overflow-hidden shadow-sm ${bgClass}`}>
        <div className="font-semibold text-gray-800 leading-tight mb-1">{data.title || 'Без названия'}</div>
        <div className="text-gray-600 mb-1">{time}{person ? ` • ${person}` : ''}</div>
        {isCompleted && (
          <div className="mt-auto inline-block bg-white/60 text-gray-600 px-1.5 py-0.5 rounded text-[10px] w-max">
            Завершено
          </div>
        )}
        {isEvent && (
          <div className="mt-auto inline-block bg-white/60 text-gray-600 px-1.5 py-0.5 rounded text-[10px] w-max">
            Мероприятие
          </div>
        )}
      </div>
    )
  }

  return (
    <article className={`px-3 py-3 ${!isLast ? 'border-b border-[#eeedf3]' : ''}`}>
      <div className="text-[15px] font-semibold text-brand-dark leading-5">{data.title || 'Без названия'}</div>
      <div className="mt-1 text-[13px] text-brand-muted">{time}</div>
      {data.spaceName && <div className="mt-1 text-[13px] text-brand-muted">{data.spaceName}</div>}
    </article>
  )
}
