import type { Booking } from '../model/types'

export interface BookingItemProps {
  booking: Booking
  isLast?: boolean
}

export function BookingItem({ booking, isLast = false }: BookingItemProps) {
  const isCompleted = booking.status === 'completed'

  return (
    <div>
      <div className="flex items-center gap-3 p-3">
        <div
          className={`w-1 min-h-[38px] self-stretch rounded-full shrink-0 ${
            isCompleted ? 'bg-[#a9a7ef]' : 'bg-[#6867e9]'
          }`}
        />
        <div className="flex flex-col">
          <span
            className={`text-[17px] font-semibold leading-snug ${
              isCompleted ? 'text-[#7e78a8]' : 'text-[#1b1b22]'
            }`}
          >
            {booking.startTime} – {booking.endTime}
          </span>
          <span
            className={`text-sm ${
              isCompleted ? 'text-[#9c98b6]' : 'text-[#6b6480]'
            }`}
          >
            {booking.spaceName}
          </span>
        </div>
      </div>
      {!isLast && <div className="h-px bg-[#eeedf3] mx-3" />}
    </div>
  )
}
