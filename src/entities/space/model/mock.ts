import type { Space } from './types'

export const MOCK_SPACES: Space[] = [
  {
    id: 1,
    name: 'Пространство А',
    capacity: 25,
    status: 'free',
    statusLabel: 'Свободно до 16:00',
    equipment: [
      { icon: 'projector', label: 'Проектор' },
      { icon: 'wifi', label: 'Wi-Fi' },
    ],
  },
  {
    id: 2,
    name: 'Пространство B',
    capacity: 8,
    status: 'busy',
    statusLabel: 'Занято до 15:00',
    equipment: [
      { icon: 'whiteboard', label: 'Маркерная доска' },
      { icon: 'table', label: 'Круглый стол' },
    ],
  },
]
