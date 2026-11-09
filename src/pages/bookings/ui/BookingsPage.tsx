import { MyBookingsBoard } from '@/widgets/my-bookings-board'
import { BookingRequestsBoard } from '@/widgets/booking-requests-board'

export interface BookingsPageProps {
  onCreateBooking: () => void
  role?: 'student' | 'admin'
}

export function BookingsPage({ onCreateBooking, role = 'student' }: BookingsPageProps) {
  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-28 flex flex-col gap-3">
      <h1 className="text-[40px] leading-none tracking-[-0.02em] text-brand-dark font-extrabold">
        {role === 'admin' ? 'Заявки' : 'Мои заявки'}
      </h1>
      {role === 'admin' ? <BookingRequestsBoard /> : <MyBookingsBoard onCreateBooking={onCreateBooking} />}
    </main>
  )
}
