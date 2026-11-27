import { getBookingFeed } from '@/shared/api/studspace'
import type { components } from '@/shared/api/schema'
import { toISODate } from '@/shared/lib/format'
import type { Booking } from '../model/types'
import { bookingApi } from './booking-api'

type BookingEntity = components['schemas']['api.Booking']
type Page = { items?: BookingEntity[]; next_cursor?: string | null }

async function findBooking(id: number, loadPage: (cursor?: string) => Promise<Page>, signal: AbortSignal) {
  let cursor: string | undefined
  const cursors = new Set<string>()
  while (!signal.aborted) {
    const page = await loadPage(cursor)
    signal.throwIfAborted()
    const booking = page.items?.find(item => item.booking_id === id)
    if (booking) return booking
    if (!page.next_cursor || cursors.has(page.next_cursor)) return undefined
    cursor = page.next_cursor
    cursors.add(cursor)
  }
  signal.throwIfAborted()
}

export async function loadScheduleBookingDetails(item: Booking, role: 'student' | 'admin', signal: AbortSignal): Promise<BookingEntity | undefined> {
  const id = Number(item.id)
  if (role === 'admin') {
    const tab = item.status === 'pending' || item.status === 'expired' ? 'new' : item.status === 'rejected' || item.status === 'withdrawn' ? 'rejected' : 'approved'
    return findBooking(id, cursor => bookingApi.getAdminBookings(tab, cursor), signal)
  }
  if (item.isMine) {
    const tab = item.status === 'pending' || item.status === 'approved' ? 'active' : 'history'
    return findBooking(id, cursor => bookingApi.getMyBookings(tab, cursor), signal)
  }
  if (item.status === 'approved' || item.status === 'completed') {
    const date = toISODate(new Date(item.startTime))
    const feed = await getBookingFeed(date, date)
    signal.throwIfAborted()
    return feed.items?.find(booking => booking.booking_id === id)
  }
  return undefined
}
