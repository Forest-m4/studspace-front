import { formatTime } from '@/shared/lib/format'
import { bookingStatusLabel } from '@/shared/lib/booking-status'
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

  const statusLabel = data.status ? bookingStatusLabel(data.status) : 'Статус не указан'
  const statusClass = data.status === 'pending' ? 'booking-slot-pending' : data.status === 'approved' ? 'booking-slot-approved' : 'booking-slot-neutral'

  const time = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`
  const person = data.type === 'booking' ? data.ownerName : data.organizer

  if (variant === 'grid') {
    return (
      <div role="group" aria-label={`${data.title || 'Без названия'}. ${statusLabel}. ${time}${person ? '. ' + person : ''}`} data-booking-status={data.status}
        className={`absolute h-full w-full rounded-md border-l-4 p-2 text-xs flex flex-col overflow-hidden shadow-sm ${statusClass}`}>
        <div className="font-semibold text-gray-800 leading-tight mb-1">{data.title || 'Без названия'}</div>
        <div className="text-gray-600 mb-1">{time}{person ? ` • ${person}` : ''}</div>
        <div className="mt-auto text-[10px] leading-tight text-gray-700">{statusLabel}</div>
      </div>
    )
  }

  return (
    <article className={`border-l-4 border-l-brand-primary px-3 py-3 ${!isLast ? 'border-b border-[#eeedf3]' : ''}`}>
      <div className="text-[17px] font-semibold text-brand-dark">{time}</div>
      {data.spaceName && <div className="mt-1 text-[13px] text-brand-muted">{data.spaceName}</div>}
    </article>
  )
}
