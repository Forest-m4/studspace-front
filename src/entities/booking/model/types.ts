export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'

export interface Booking {
  id: string | number
  startTime: string
  endTime: string
  spaceName: string
  spaceId?: string | number
  status?: BookingStatus
  title?: string
  date?: string
}
