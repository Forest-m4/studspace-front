import { useState } from 'react'
import { MOCK_NEW_BOOKING_DRAFT } from '@/entities/booking-draft'
import type { NewBookingDraft } from '@/entities/booking-draft'
import { BookingDatePickerModal } from '@/widgets/booking-date-picker-modal'
import { NewBookingForm } from '@/widgets/new-booking-form'

export interface NewBookingPageProps {
  onClose: () => void
}

function formatBookingDate(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`)
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function NewBookingPage({ onClose }: NewBookingPageProps) {
  const [draft, setDraft] = useState<NewBookingDraft>(MOCK_NEW_BOOKING_DRAFT)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleDateSelect = (nextDateISO: string) => {
    setDraft({
      ...draft,
      dateISO: nextDateISO,
      dateLabel: formatBookingDate(nextDateISO),
    })
    setIsDatePickerOpen(false)
  }

  return (
    <>
      <NewBookingForm
        draft={draft}
        onChange={setDraft}
        onOpenDatePicker={() => setIsDatePickerOpen(true)}
        onClose={onClose}
      />
      {isDatePickerOpen && (
        <BookingDatePickerModal
          selectedDateISO={draft.dateISO}
          onClose={() => setIsDatePickerOpen(false)}
          onSelect={handleDateSelect}
        />
      )}
    </>
  )
}
