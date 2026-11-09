import type { BookingSpaceOption, NewBookingDraft } from './types'

export const BOOKING_SPACE_OPTIONS: BookingSpaceOption[] = [
  {
    id: 'space-a',
    name: 'Пространство A',
    capacityLabel: 'до 25 чел.',
    color: 'violet',
  },
  {
    id: 'space-b',
    name: 'Пространство B',
    capacityLabel: 'до 8 чел.',
    color: 'lime',
  },
]

export const MOCK_NEW_BOOKING_DRAFT: NewBookingDraft = {
  spaceId: 'space-b',
  fullName: 'Анна Соколова',
  dateISO: '2026-10-16',
  dateLabel: 'Пятница, 16 октября',
  fromTime: '15:00',
  toTime: '16:30',
  eventTitle: '',
  purpose: 'Подготовка к защите курсовой',
  peopleCount: 4,
  peopleLimit: 8,
}

export const BOOKING_TIME_WARNING = 'Переговорная занята 13:30-15:00'
export const BOOKING_PURPOSE_LIMIT = 150
