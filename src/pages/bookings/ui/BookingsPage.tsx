import { BookingRequestsBoard } from '@/widgets/booking-requests-board'

export function BookingsPage() {
  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-28 flex flex-col gap-3">
      <header className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-[#a9a7ef] text-white text-[15px] font-semibold flex items-center justify-center shrink-0">
          E
        </div>
        <div>
          <p className="text-[12px] leading-3 text-brand-muted">Администратор</p>
          <h1 className="mt-1 text-[40px] leading-none tracking-[-0.02em] text-brand-dark font-extrabold">Заявки</h1>
        </div>
      </header>

      <BookingRequestsBoard />
    </main>
  )
}
