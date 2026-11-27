import { expect, it } from 'vitest'
import { mapApiAdminBookingToRequest, mapApiBookingsToMyBookings } from '@/shared/api/adapters'
import { bookingStatusLabel } from '@/shared/lib/booking-status'
import { weekRange, toISODate } from '@/shared/lib/format'
it('retains terminal statuses and the actual owner of a cancellation', () => {
  const [item] = mapApiBookingsToMyBookings([{ booking_id: 1, status: 'expired', actions: ['rebook'] }], 'history')
  expect(bookingStatusLabel(item.status)).toBe('Срок заявки истёк')
  expect(bookingStatusLabel('cancelled', 'admin')).toBe('Отменена администратором')
  expect(mapApiAdminBookingToRequest({ booking_id: 2, status: 'completed' }).bookingStatus).toBe('completed')
})
it('uses actual space capacity and shows overlapping applications', () => {
  const item = mapApiAdminBookingToRequest({ booking_id: 1, status: 'pending', space: { space_id: 2 }, people_count: 4, conflicts: [{ owner_name: 'Мария', starts_at: '2026-12-01T10:00:00+03:00', ends_at: '2026-12-01T11:00:00+03:00' }] }, [{ space_id: 2, capacity: 8 }])
  expect(item.peopleLimit).toBe(8)
  expect(item.warningText).toContain('Мария (10:00–11:00)')
})
it('calculates Moscow dates and a full week across the year boundary', () => {
  expect(toISODate(new Date('2026-12-31T22:30:00Z'))).toBe('2027-01-01')
  expect(weekRange('2027-01-01')).toEqual({ from: '2026-12-28', to: '2027-01-03' })
})
