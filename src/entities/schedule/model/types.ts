export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'

export interface Booking {
  id: string | number
  startTime: string
  endTime: string
  spaceId: number
  spaceName: string
  title: string
  status?: BookingStatus
  ownerName?: string
  organizer?: string
  type: 'booking' | 'event'
  isMine?: boolean
  date?: string
}

export interface ScheduleSpace {
  id: number
  name: string
  capacity: number
  color: string
}
