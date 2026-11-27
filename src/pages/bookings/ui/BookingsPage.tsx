import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/user/model/session-context'
import { routes } from '@/shared/config'
import { BookingRequestsBoard } from '@/widgets/booking-requests-board'
import { MyBookingsBoard } from '@/widgets/my-bookings-board'
export interface BookingsPageProps { onCreateBooking?: () => void; role?: 'student' | 'admin' }
export function BookingsPage({ onCreateBooking, role }: BookingsPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSession()
  const currentRole = role ?? user.role ?? 'student'
  const [notice, setNotice] = useState<string>(location.state?.notice ?? '')
  return <main className="page-shell flex flex-col gap-4">
    {currentRole === 'admin' && <p className="text-[13px] text-brand-muted">Администратор</p>}
    <h1 className="text-[26px] font-bold">{currentRole === 'admin' ? 'Заявки' : 'Мои заявки'}</h1>
    {notice && <div role="status" className="success-message flex items-start justify-between gap-3">{notice}<button aria-label="Скрыть сообщение" onClick={() => setNotice('')}>×</button></div>}
    {currentRole === 'admin' ? <BookingRequestsBoard /> : <MyBookingsBoard onCreateBooking={onCreateBooking ?? (() => navigate(routes.newBooking))} />}
  </main>
}
