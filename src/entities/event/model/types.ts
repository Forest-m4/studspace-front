export interface EventWeekDay {
  short: string
  day: number
  active?: boolean
}

export interface FeaturedEvent {
  badge: string
  startTime: string
  endTime: string
  title: string
}

export interface EventListItem {
  id: string
  dateLabel: string
  day: string
  month: string
  title: string
  time: string
}
