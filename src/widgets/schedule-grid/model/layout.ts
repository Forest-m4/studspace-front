import type { Booking } from '@/entities/schedule'

// Connected groups share a lane count; adjacent intervals can reuse a lane.
export function layoutBookings(items: Booking[]) {
  const result: { item: Booking; lane: number; lanes: number }[] = []
  let group: typeof result = []
  let laneEnds: number[] = []
  let groupEnd = -Infinity
  const flush = () => {
    result.push(...group.map(entry => ({ ...entry, lanes: laneEnds.length })))
    group = []
    laneEnds = []
  }
  for (const item of [...items].sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime))) {
    const start = Date.parse(item.startTime)
    const end = Date.parse(item.endTime)
    if (start >= groupEnd) {
      flush()
      groupEnd = end
    } else groupEnd = Math.max(groupEnd, end)
    let lane = laneEnds.findIndex(laneEnd => laneEnd <= start)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = end
    group.push({ item, lane, lanes: 1 })
  }
  flush()
  return result
}
