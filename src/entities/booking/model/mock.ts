import type { Booking } from './types'

export const MOCK_TODAY_BOOKINGS: Booking[] = [
  {
    id: 1,
    startTime: '10:00',
    endTime: '12:00',
    spaceName: 'Пространство А',
    status: 'completed',
  },
  {
    id: 2,
    startTime: '13:30',
    endTime: '15:00',
    spaceName: 'Пространство Б',
    status: 'completed',
  },
  {
    id: 3,
    startTime: '16:00',
    endTime: '18:30',
    spaceName: 'Пространство А',
    status: 'confirmed',
  },
]
