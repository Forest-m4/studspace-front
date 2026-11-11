import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingApi } from '@/entities/booking'
import { BOOKING_SPACE_OPTIONS, MOCK_NEW_BOOKING_DRAFT } from '@/entities/booking-draft'
import type { BookingSpaceOption, NewBookingDraft } from '@/entities/booking-draft'
import { spaceApi } from '@/entities/space'
import { NewBookingForm } from '@/features/create-booking'
import { routes } from '@/shared/config'
import { formatDateLabel } from '@/shared/lib'
import { BookingDatePickerModal } from '@/widgets/booking-date-picker-modal'

export interface NewBookingPageProps {
  onClose?: () => void
}

export function NewBookingPage({ onClose }: NewBookingPageProps) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<NewBookingDraft>(MOCK_NEW_BOOKING_DRAFT)
  const [spaceOptions, setSpaceOptions] = useState<BookingSpaceOption[]>(BOOKING_SPACE_OPTIONS)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(routes.home)
    }
  }

  useEffect(() => {
    spaceApi
      .getSpaces()
      .then((spaces) => {
        if (!spaces) return

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
      })
      .catch(() => undefined)
  }, [])

  const handleDateSelect = (nextDateISO: string) => {
    setDraft({
      ...draft,
      dateISO: nextDateISO,
      dateLabel: formatDateLabel(`${nextDateISO}T00:00:00`),
    })
    setIsDatePickerOpen(false)
  }

  const handleSubmit = async () => {
    await bookingApi.createBooking({
      space_id: draft.spaceId,
      starts_at: `${draft.dateISO}T${draft.fromTime}:00`,
      ends_at: `${draft.dateISO}T${draft.toTime}:00`,
      people_count: draft.peopleCount,
      purpose: draft.purpose,
    })
    handleClose()
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
        onClose={handleClose}
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
