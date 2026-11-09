import { useEffect, useState } from 'react'
import { BOOKING_SPACE_OPTIONS, MOCK_NEW_BOOKING_DRAFT } from '@/entities/booking-draft'
import type { BookingSpaceOption, NewBookingDraft } from '@/entities/booking-draft'
import { BookingDatePickerModal } from '@/widgets/booking-date-picker-modal'
import { NewBookingForm } from '@/widgets/new-booking-form'
import { createBooking, getSpaces } from '@/shared/api/studspace'

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
  const [spaceOptions, setSpaceOptions] = useState<BookingSpaceOption[]>(BOOKING_SPACE_OPTIONS)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  useEffect(() => {
    let active = true

    const loadSpaces = async () => {
      const spaces = await getSpaces()
      if (!spaces || !active) return

      const normalized = spaces.map((space) => ({
        id: space.space_id ?? 0,
        name: space.name ?? 'Помещение',
        capacityLabel: `до ${space.capacity ?? 0} чел.`,
        color: ((space.color ?? '').toLowerCase().includes('d2f8') ? 'lime' : 'violet') as BookingSpaceOption['color'],
      }))

      setSpaceOptions(normalized)

      setDraft((prev) => {
        const exists = normalized.some((space) => space.id === prev.spaceId)
        if (exists || !normalized[0]) return prev

        return {
          ...prev,
          spaceId: normalized[0].id,
          peopleLimit: Number(normalized[0].capacityLabel.match(/\d+/)?.[0] ?? 8),
        }
      })
    }

    loadSpaces().catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  const handleDateSelect = (nextDateISO: string) => {
    setDraft({
      ...draft,
      dateISO: nextDateISO,
      dateLabel: formatBookingDate(nextDateISO),
    })
    setIsDatePickerOpen(false)
  }

  const handleSubmit = async () => {
    await createBooking({
      space_id: draft.spaceId,
      starts_at: `${draft.dateISO}T${draft.fromTime}:00`,
      ends_at: `${draft.dateISO}T${draft.toTime}:00`,
      people_count: draft.peopleCount,
      purpose: draft.purpose,
    })
    onClose()
  }

  return (
    <>
      <NewBookingForm
        spaceOptions={spaceOptions}
        draft={draft}
        onChange={setDraft}
        onOpenDatePicker={() => setIsDatePickerOpen(true)}
        onSubmit={() => {
          handleSubmit().catch(() => undefined)
        }}
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
