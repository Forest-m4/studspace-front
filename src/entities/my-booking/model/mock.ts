import type { MyBooking, MyBookingTab } from './types'

export const MY_BOOKING_TABS: { key: MyBookingTab; label: string }[] = [
  { key: 'active', label: 'Активные' },
  { key: 'history', label: 'История' },
]

export const MOCK_MY_BOOKINGS: MyBooking[] = [
  {
    id: 'active-1',
    tab: 'active',
    status: 'pending',
    createdAtLabel: 'только что',
    dateTimeLabel: '15:00-16:30\nПятница, 16 октября',
    spaceAndPeople: 'Пространство B · 4 человека',
    purpose: 'Подготовка к защите курсовой',
    statusNote: 'Обычно рассматривают в течение 2 часов',
  },
  {
    id: 'active-2',
    tab: 'active',
    status: 'approved',
    createdAtLabel: '16 окт',
    dateTimeLabel: '12:00-14:00\nСуббота, 17 октября',
    spaceAndPeople: 'Пространство B · 5 человек',
    purpose: 'Работа над курсовым проектом',
  },
  {
    id: 'history-1',
    tab: 'history',
    status: 'rejected',
    dateTimeLabel: 'Ср, 21 окт · 17:00-19:00',
    spaceAndPeople: 'Пространство A · 15 человек',
    purpose: 'Подготовка к защите курсовых',
    rejectReason: 'В это время проходит мероприятие «Встреча с выпускниками»',
  },
  {
    id: 'history-2',
    tab: 'history',
    status: 'completed',
    dateTimeLabel: 'Пн, 12 окт · 14:00-16:00',
    spaceAndPeople: 'Пространство B · 3 человека',
    purpose: 'Консультация по курсовой',
  },
  {
    id: 'history-3',
    tab: 'history',
    status: 'cancelled',
    dateTimeLabel: 'Ср, 7 окт · 18:00-20:00',
    spaceAndPeople: 'Пространство A · 8 человек',
    purpose: 'Встреча команды стартапа',
  },
]
