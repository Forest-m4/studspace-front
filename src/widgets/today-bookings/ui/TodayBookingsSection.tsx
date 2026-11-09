import { ChevronRight } from 'lucide-react'
import { Card } from '@/shared/ui'
import { BookingItem } from '@/entities/booking'
import type { Booking } from '@/entities/booking'

export interface TodayBookingsSectionProps {
  bookings: Booking[]
  onViewAll?: () => void
}

export function TodayBookingsSection({ bookings, onViewAll }: TodayBookingsSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center px-1">
        <h2 className="text-[20px] font-bold text-[#1f1a3d] leading-7 flex-1">Сегодня</h2>
      </div>
      <Card className="rounded-2xl overflow-hidden">
        {bookings.map((booking, index) => (
          <BookingItem
            key={booking.id}
            booking={booking}
            isLast={index === bookings.length - 1}
          />
        ))}
        <div className="h-px bg-[#eeedf3] mx-3" />
        <button
          onClick={onViewAll}
          className="flex items-center justify-center gap-1.5 p-3 w-full hover:bg-black/[0.02] transition-colors cursor-pointer"
        >
          <span className="text-[16px] font-semibold text-[#6c63e6]">
            Открыть весь календарь
          </span>
          <ChevronRight size={11} className="text-[#6c63e6]" strokeWidth={2.5} />
        </button>
      </Card>
    </section>
  )
}
