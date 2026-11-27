export interface BookingSpaceOption {
  id: number
  name: string
  capacityLabel: string
  color: 'violet' | 'lime'
}

export interface NewBookingDraft {
  spaceId: number
  firstName: string
  lastName: string
  dateISO: string
  dateLabel: string
  fromTime: string
  toTime: string
  eventTitle: string
  purpose: string
  peopleCount: number
  peopleLimit: number
}
