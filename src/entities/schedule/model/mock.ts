import type { Booking, ScheduleSpace } from './types'

export const MOCK_SCHEDULE_SPACES: ScheduleSpace[] = [
  { id: 1, name: 'Пространство А', capacity: 25, color: '#a9a7ef' },
  { id: 2, name: 'Пространство B', capacity: 8, color: '#6de89e' },
]

export const MOCK_SCHEDULE_ITEMS: Booking[] = [
  {
    id: 1,
    startTime: '2026-10-16T10:00:00',
    endTime: '2026-10-16T12:00:00',
    title: 'Подготовка к хакатону',
    ownerName: 'Кирилл Морозов',
    spaceId: 1,
    spaceName: 'Пространство А',
    status: 'completed',
    type: 'booking',
    isMine: true,
  },
  {
    id: 2,
    startTime: '2026-10-16T13:30:00',
    endTime: '2026-10-16T15:00:00',
    title: 'Встреча команды стартапа',
    ownerName: 'Елена Смирн.',
    spaceId: 2,
    spaceName: 'Пространство B',
    status: 'approved',
    type: 'booking',
    isMine: false,
  },
  {
    id: 3,
    startTime: '2026-10-16T16:00:00',
    endTime: '2026-10-16T18:30:00',
    title: 'Мастер-класс по Figma',
    organizer: 'Студсовет ФИ',
    spaceId: 1,
    spaceName: 'Пространство А',
    type: 'event',
  },
]
