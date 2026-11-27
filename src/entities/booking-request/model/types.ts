export type RequestTab = 'new' | 'approved' | 'rejected'

export interface BookingRequest {
  id: string
  bookingId?: number
  bookingStatus?: string
  vkUserId?: number
  decisionReasonTitle?: string
  status: RequestTab
  applicantInitials: string
  createdAtLabel: string
  spaceName: string
  capacityLabel: string
  lastName: string
  firstName: string
  dateLabel: string
  fromTime: string
  toTime: string
  purpose: string
  peopleCount: number
  peopleLimit?: number
  warningText?: string
  decisionReason?: string
  decisionMeta?: string
  actionLabel?: string
  actionVariant?: 'danger' | 'muted'
}
