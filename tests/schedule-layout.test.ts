import { expect, it } from 'vitest'
import type { Booking } from '@/entities/schedule'
import { layoutBookings } from '@/widgets/schedule-grid/model/layout'

it('separates intersecting intervals, reuses lanes at boundaries and restores full width for a separate group', () => {
  const interval = (id: number, from: string, to: string): Booking => ({ id, type: 'booking', startTime: '2099-12-01T' + from + ':00+03:00', endTime: '2099-12-01T' + to + ':00+03:00' })
  const layout = layoutBookings([
    interval(4, '18:00', '19:00'), interval(2, '15:30', '16:30'),
    interval(3, '16:00', '17:00'), interval(1, '15:00', '16:00'),
  ])
  expect(layout.map(entry => entry.item.id)).toEqual([1, 2, 3, 4])
  for (const a of layout) for (const b of layout) {
    if (a === b) continue
    const intersects = Date.parse(a.item.startTime) < Date.parse(b.item.endTime) && Date.parse(a.item.endTime) > Date.parse(b.item.startTime)
    if (intersects) expect(a.lane).not.toBe(b.lane)
  }
  expect(layout.filter(entry => entry.item.id !== 4).every(entry => entry.lanes === 2)).toBe(true)
  expect(layout.at(-1)).toMatchObject({ lane: 0, lanes: 1 })
})
