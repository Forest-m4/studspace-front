import { MyBookingsBoard } from '@/widgets/my-bookings-board'

export interface BookingsPageProps {
  onCreateBooking: () => void
}

export function BookingsPage({ onCreateBooking }: BookingsPageProps) {
  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-28 flex flex-col gap-3">
      <h1 className="text-[40px] leading-none tracking-[-0.02em] text-brand-dark font-extrabold">Мои заявки</h1>
      <MyBookingsBoard onCreateBooking={onCreateBooking} />
    </main>
  )
}
