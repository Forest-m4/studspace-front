export type MyBookingTab = 'active' | 'history'
export type MyBookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'

export interface MyBooking {
  id: string
  bookingId?: number
  tab: MyBookingTab
  status: MyBookingStatus
  createdAtLabel?: string
  dateTimeLabel: string
  spaceAndPeople: string
  purpose: string
  statusNote?: string
  rejectReason?: string
  startsAt?: string
  endsAt?: string
  spaceId?: number
}
