import { useOutletContext, useNavigate } from 'react-router-dom'
import { routes } from '@/shared/config'
import { BookingRequestsBoard } from '@/widgets/booking-requests-board'
import { MyBookingsBoard } from '@/widgets/my-bookings-board'

export interface BookingsPageProps {
  onCreateBooking?: () => void
  role?: 'student' | 'admin'
}

export function BookingsPage({ onCreateBooking, role }: BookingsPageProps) {
  const navigate = useNavigate()
  const context = useOutletContext<{ role?: 'student' | 'admin' } | undefined>()
  const currentRole = role ?? context?.role ?? 'student'

  const handleCreateBooking = () => {
    if (onCreateBooking) {
      onCreateBooking()
      return
    }
    navigate(routes.newBooking)
  }

  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-28 flex flex-col gap-3">
      <h1 className="text-[40px] leading-none tracking-[-0.02em] text-brand-dark font-extrabold">
        {currentRole === 'admin' ? 'Заявки' : 'Мои заявки'}
      </h1>
      {currentRole === 'admin' ? (
        <BookingRequestsBoard />
      ) : (
        <MyBookingsBoard onCreateBooking={handleCreateBooking} />
      )}
    </main>
  )
}
