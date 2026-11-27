import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { bookingApi } from '@/entities/booking'
import { spaceApi } from '@/entities/space'
import { mapApiScheduleToView } from '@/shared/api/adapters'
import { BookingRequestsBoard } from '@/widgets/booking-requests-board'
import { ScheduleGrid } from '@/widgets/schedule-grid'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

it('shows the event title separately from its purpose while an admin reviews it', async () => {
  vi.spyOn(bookingApi, 'getAdminBookings').mockResolvedValue({ items: [{ booking_id: 1, status: 'pending', title: 'Клуб настольных игр', purpose: 'Провести встречу первокурсников' }], counters: { new: 1 } })
  vi.spyOn(spaceApi, 'getSpaces').mockResolvedValue([])
  render(<BookingRequestsBoard />)
  expect(await screen.findByText('Провести встречу первокурсников')).toBeTruthy()
  expect(screen.queryByText('Название мероприятия')).not.toBeNull()
  expect(screen.queryByText('Клуб настольных игр')).not.toBeNull()
})

it.each(['day', 'week'] as const)('distinguishes pending and approved slots in %s view regardless of ownership', viewMode => {
  const view = mapApiScheduleToView({ spaces: [{ space_id: 1, name: 'Зал А', capacity: 25 }], items: [
    { booking_id: 1, space_id: 1, title: 'Ожидает решения', status: 'pending', starts_at: '2099-12-01T15:00:00+03:00', ends_at: '2099-12-01T16:00:00+03:00', is_mine: true },
    { booking_id: 2, space_id: 1, title: 'Одобренная встреча', status: 'approved', starts_at: '2099-12-01T17:00:00+03:00', ends_at: '2099-12-01T18:00:00+03:00', is_mine: false },
  ] })
  render(<ScheduleGrid {...view} selectedDate="2099-12-01" viewMode={viewMode} onSelectSlot={vi.fn()} onSelectBooking={vi.fn()} />)
  expect(screen.queryByRole('group', { name: /Ожидает решения.*На рассмотрении/ })).not.toBeNull()
  expect(screen.queryByRole('group', { name: /Одобренная встреча.*Подтверждена/ })).not.toBeNull()
  expect(screen.getByRole('button', { name: 'Забронировать Зал А, 2099-12-01, 15:00–15:30' }).hasAttribute('disabled')).toBe(true)
  expect(screen.getByRole('button', { name: 'Забронировать Зал А, 2099-12-01, 16:00–16:30' }).hasAttribute('disabled')).toBe(false)
})

it.each(['day', 'week'] as const)('keeps overlapping applications independently selectable in %s view', viewMode => {
  const view = mapApiScheduleToView({ spaces: [{ space_id: 1, name: 'Зал А', capacity: 25 }], items: [
    { booking_id: 1, space_id: 1, title: 'Первая заявка', status: 'pending', starts_at: '2099-12-01T15:00:00+03:00', ends_at: '2099-12-01T17:00:00+03:00' },
    { booking_id: 2, space_id: 1, title: 'Вторая заявка', status: 'pending', starts_at: '2099-12-01T15:00:00+03:00', ends_at: '2099-12-01T17:00:00+03:00' },
  ] })
  const select = vi.fn()
  render(<ScheduleGrid {...view} selectedDate="2099-12-01" viewMode={viewMode} onSelectSlot={vi.fn()} onSelectBooking={select} />)
  const first = screen.getByRole('button', { name: /Открыть заявку «Первая заявка»/ })
  const second = screen.getByRole('button', { name: /Открыть заявку «Вторая заявка»/ })
  const firstBounds = first.parentElement!.style
  const secondBounds = second.parentElement!.style
  expect(parseFloat(firstBounds.left) + parseFloat(firstBounds.width)).toBeLessThanOrEqual(parseFloat(secondBounds.left))
  fireEvent.click(first)
  fireEvent.click(second)
  expect(select.mock.calls.map(([item]) => item.id)).toEqual(view.items.map(item => item.id))
})
