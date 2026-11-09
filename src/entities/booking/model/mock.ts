import type { Booking } from './types';

export const MOCK_TODAY_BOOKINGS: Booking[] = [
  {
    id: 1,
    startTime: '2026-10-16T10:00:00',
    endTime: '2026-10-16T12:00:00',
    spaceName: 'Пространство А',
    status: 'completed',
    type: 'booking', 
    title: 'Встреча',
  },
  {
    id: 2,
    startTime: '2026-10-16T13:30:00',
    endTime: '2026-10-16T15:00:00',
    spaceName: 'Пространство Б',
    status: 'completed',
    type: 'booking',
    title: 'Созвон',
  },
  {
    id: 3,
    startTime: '2026-10-16T16:00:00',
    endTime: '2026-10-16T18:30:00',
    spaceName: 'Пространство А',
    status: 'approved', 
    type: 'booking',
    title: 'Мастер-класс',
  },
];