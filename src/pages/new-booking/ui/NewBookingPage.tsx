import { useState } from 'react'
import { MOCK_NEW_BOOKING_DRAFT } from '@/entities/booking-draft'
import type { NewBookingDraft } from '@/entities/booking-draft'
import { NewBookingForm } from '@/widgets/new-booking-form'

export interface NewBookingPageProps {
  onClose: () => void
}

export function NewBookingPage({ onClose }: NewBookingPageProps) {
  const [draft, setDraft] = useState<NewBookingDraft>(MOCK_NEW_BOOKING_DRAFT)

  return <NewBookingForm draft={draft} onChange={setDraft} onClose={onClose} />
}
