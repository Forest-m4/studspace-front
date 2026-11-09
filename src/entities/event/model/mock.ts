import type { EventListItem, EventWeekDay, FeaturedEvent } from './types'

export const MOCK_EVENTS_COUNT = 5

export const MOCK_EVENTS_WEEK: EventWeekDay[] = [
  { short: 'Пн', day: 12 },
  { short: 'Вт', day: 13 },
  { short: 'Ср', day: 14 },
  { short: 'Чт', day: 15 },
  { short: 'Пт', day: 16, active: true },
  { short: 'Сб', day: 17 },
  { short: 'Вс', day: 18 },
]

export const MOCK_FEATURED_EVENT: FeaturedEvent = {
  badge: 'Сегодня',
  startTime: '16:00',
  endTime: '18:30',
  title: 'Мастер-класс по Figma',
}

export const MOCK_EVENTS: EventListItem[] = [
  {
    id: 'event-20-oct',
    dateLabel: 'Вторник, 20 октября',
    day: '20',
    month: 'окт',
    title: 'Разбор задач олимпиады по программированию',
    time: '18:00-20:00',
  },
  {
    id: 'event-21-oct',
    dateLabel: 'Среда, 21 октября',
    day: '21',
    month: 'окт',
    title: 'Встреча с выпускниками: карьера в IT',
    time: '17:00-19:00',
  },
  {
    id: 'event-24-oct',
    dateLabel: 'Суббота, 24 октября',
    day: '24',
    month: 'окт',
    title: 'Игротека: настольные игры',
    time: '15:00-19:00',
  },
]
