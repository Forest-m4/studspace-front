import type { Booking } from '@/entities/booking'

export const START_HOUR = 9
export const END_HOUR = 23
export const HOUR_HEIGHT = 60

export const calculateItemPosition = (item: Booking) => {
  const startDate = new Date(item.startTime)
  const endDate = new Date(item.endTime)

  const startDecimal = startDate.getHours() + startDate.getMinutes() / 60
  const endDecimal = endDate.getHours() + endDate.getMinutes() / 60

  const top = (startDecimal - START_HOUR) * HOUR_HEIGHT
  const height = (endDecimal - startDecimal) * HOUR_HEIGHT - 4

  return { top, height: Math.max(height, 30) }
}
