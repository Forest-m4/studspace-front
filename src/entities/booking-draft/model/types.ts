export interface BookingSpaceOption {
  id: string
  name: string
  capacityLabel: string
  color: 'violet' | 'lime'
}

export interface NewBookingDraft {
  spaceId: string
  fullName: string
  dateLabel: string
  fromTime: string
  toTime: string
  eventTitle: string
  purpose: string
  peopleCount: number
  peopleLimit: number
}
