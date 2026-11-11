import { useEffect, useMemo, useState } from 'react'
import { CalendarPlus2, Clock3, Plus } from 'lucide-react'
import { bookingApi } from '@/entities/booking'
import { MOCK_MY_BOOKINGS, MY_BOOKING_TABS } from '@/entities/my-booking'
import type { MyBooking, MyBookingStatus, MyBookingTab } from '@/entities/my-booking'
import { mapApiBookingsToMyBookings } from '@/shared/api/adapters'
import { cn } from '@/shared/lib'

export interface MyBookingsBoardProps {
  onCreateBooking: () => void
}

function statusBadge(status: MyBookingStatus) {
  if (status === 'pending') return { label: 'На рассмотрении', className: 'bg-[#eeedfc] text-brand-primary' }
  if (status === 'approved') return { label: 'Подтверждена', className: 'bg-[#daf6e8] text-[#2e9e6b]' }
  if (status === 'rejected') return { label: 'Отклонена', className: 'bg-[#fde8eb] text-[#d85068]' }
  if (status === 'completed') return { label: 'Завершена', className: 'bg-[#f0f0f5] text-[#8a88a5]' }
  return { label: 'Отменена вами', className: 'bg-[#f0f0f5] text-[#8a88a5]' }
}

function ActiveBookingCard({
  booking,
  onWithdraw,
  onCancel,
  onReschedule,
}: {
  booking: MyBooking
  onWithdraw: (bookingId?: number) => void
  onCancel: (bookingId?: number) => void
  onReschedule: (booking: MyBooking) => void
}) {
  const badge = statusBadge(booking.status)
  const [timeLine, dateLine] = booking.dateTimeLabel.split('\n')

  return (
    <article className="rounded-3xl bg-white border border-black/[0.03] overflow-hidden">
      <div className="px-4 py-3 border-l-3 border-[#b8d415]">
        <div className="flex items-center justify-between">
          <span className={cn('text-[12px] px-2 py-0.5 rounded-full font-medium', badge.className)}>
            {badge.label}
          </span>
          <span className="text-[12px] text-brand-muted">{booking.createdAtLabel}</span>
        </div>
        <p className="mt-2 text-[38px] leading-none font-bold text-brand-dark">{timeLine}</p>
        <p className="mt-1 text-[16px] text-brand-muted">{dateLine}</p>
        <p className="mt-2 text-[16px] text-brand-dark">• {booking.spaceAndPeople}</p>
        <p className="mt-1 text-[14px] text-brand-muted">{booking.purpose}</p>
        {booking.statusNote && (
          <p className="mt-2 text-[13px] text-brand-muted inline-flex items-center gap-1.5">
            <Clock3 size={13} />
            {booking.statusNote}
          </p>
        )}
      </div>
      <div className="h-px bg-[#efeff4]" />
      <div className="px-4 py-2">
        {booking.status === 'pending' ? (
          <button
            type="button"
            onClick={() => onWithdraw(booking.bookingId)}
            className="text-[16px] text-brand-muted hover:text-brand-dark transition-colors"
          >
            Отозвать заявку
          </button>
        ) : (
          <div className="flex items-center gap-4 text-[16px]">
            <button
              type="button"
              onClick={() => onReschedule(booking)}
              className="text-brand-primary hover:text-[#5c5adf] transition-colors"
            >
              Перенести
            </button>
            <button
              type="button"
              onClick={() => onCancel(booking.bookingId)}
              className="text-[#dd596c] hover:text-[#c54f5f] transition-colors"
            >
              Отменить
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

function HistoryBookingCard({ booking }: { booking: MyBooking }) {
  const badge = statusBadge(booking.status)

  return (
    <article className="rounded-3xl bg-white border border-black/[0.03] px-3 py-3">
      <div className="border-l-3 border-[#7f7ef0] pl-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[16px] font-semibold text-brand-dark">{booking.dateTimeLabel}</p>
          <span className={cn('text-[12px] px-2 py-0.5 rounded-full', badge.className)}>{badge.label}</span>
        </div>
        <p className="mt-1 text-[14px] text-brand-muted">• {booking.spaceAndPeople}</p>
        <p className="mt-1 text-[14px] text-brand-muted">{booking.purpose}</p>
        {booking.rejectReason && (
          <p className="mt-2 rounded-xl bg-[#ffeef1] text-[#9f5564] px-3 py-2 text-[13px] leading-4">
            {booking.rejectReason}
          </p>
        )}
        {booking.status === 'rejected' && (
          <button type="button" className="mt-2 text-[16px] text-brand-primary hover:text-[#5c5adf] transition-colors">
            Забронировать снова
          </button>
        )}
      </div>
    </article>
  )
}

export function MyBookingsBoard({ onCreateBooking }: MyBookingsBoardProps) {
  const [activeTab, setActiveTab] = useState<MyBookingTab>('active')
  const [items, setItems] = useState<MyBooking[]>(MOCK_MY_BOOKINGS)

  const reloadTab = (tab: MyBookingTab) => {
    bookingApi
      .getMyBookings(tab)
      .then((data) => {
        if (!data) return
        const nextItems = mapApiBookingsToMyBookings(data.items, tab)
        setItems((prev) => {
          const other = prev.filter((item) => item.tab !== tab)
          return [...other, ...nextItems]
        })
      })
      .catch(() => undefined)
  }

  useEffect(() => {
    bookingApi
      .getMyBookings(activeTab)
      .then((data) => {
        if (!data) return
        const nextItems = mapApiBookingsToMyBookings(data.items, activeTab)
        setItems((prev) => {
          const other = prev.filter((item) => item.tab !== activeTab)
          return [...other, ...nextItems]
        })
      })
      .catch(() => undefined)
  }, [activeTab])

  const handleWithdraw = async (bookingId?: number) => {
    if (!bookingId) return
    await bookingApi.withdrawBooking(bookingId)
    reloadTab('active')
  }

  const handleCancel = async (bookingId?: number) => {
    if (!bookingId) return
    await bookingApi.cancelBooking(bookingId)
    reloadTab('active')
  }

  const handleReschedule = async (booking: MyBooking) => {
    if (!booking.bookingId || !booking.startsAt || !booking.endsAt || !booking.spaceId) return

    const start = new Date(booking.startsAt)
    const end = new Date(booking.endsAt)
    start.setDate(start.getDate() + 1)
    end.setDate(end.getDate() + 1)

    await bookingApi.rescheduleBooking(booking.bookingId, {
      space_id: booking.spaceId,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
    })
    reloadTab('active')
  }

  const tabItems = useMemo(
    () => items.filter((item) => item.tab === activeTab),
    [items, activeTab],
  )

  return (
    <section className="flex flex-col gap-3 relative">
      <div className="rounded-2xl bg-white p-1 grid grid-cols-2 gap-1">
        {MY_BOOKING_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'h-8 rounded-xl text-[14px] transition-colors',
              activeTab === tab.key ? 'bg-brand-primary text-white' : 'text-brand-dark hover:bg-[#f2f2f8]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'history' && <p className="text-[14px] text-brand-muted px-1">Октябрь 2026</p>}

      {tabItems.length === 0 && activeTab === 'active' ? (
        <div className="rounded-3xl bg-white p-5 mt-16 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-[#eeedfc] text-brand-primary inline-flex items-center justify-center">
            <CalendarPlus2 size={32} />
          </div>
          <p className="mt-4 text-[30px] leading-none font-bold text-brand-dark">Заявок пока нет</p>
          <p className="mt-2 text-[18px] leading-6 text-brand-muted">
            Забронируйте пространство - заявка появится здесь
          </p>
          <button
            type="button"
            onClick={onCreateBooking}
            className="mt-4 h-12 px-6 rounded-2xl bg-brand-accent text-brand-dark text-[16px] font-semibold"
          >
            + Новая заявка
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tabItems.map((item) =>
            activeTab === 'active' ? (
              <ActiveBookingCard
                key={item.id}
                booking={item}
                onWithdraw={handleWithdraw}
                onCancel={handleCancel}
                onReschedule={handleReschedule}
              />
            ) : (
              <HistoryBookingCard key={item.id} booking={item} />
            ),
          )}
        </div>
      )}

      {activeTab === 'active' && tabItems.length > 0 && (
        <button
          type="button"
          onClick={onCreateBooking}
          className="fixed right-5 bottom-24 h-12 w-12 rounded-full bg-brand-accent text-brand-dark inline-flex items-center justify-center shadow-lg"
        >
          <Plus size={20} />
        </button>
      )}
    </section>
  )
}
