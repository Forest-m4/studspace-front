import { useEffect, useState } from 'react'
import { MOCK_EVENTS, MOCK_EVENTS_COUNT, MOCK_EVENTS_WEEK, MOCK_FEATURED_EVENT } from '@/entities/event'
import type { EventListItem, EventWeekDay, FeaturedEvent } from '@/entities/event'
import { EventsOverview } from '@/widgets/events-overview'
import { EventsList } from '@/widgets/events-list'
import {
  cancelAdminEvent,
  createAdminEvent,
  getEvents,
  registerEvent,
  subscribeWaitlist,
  unregisterEvent,
  unsubscribeWaitlist,
  updateAdminEvent,
} from '@/shared/api/studspace'
import { mapApiEventsToEventsView } from '@/shared/api/adapters'

export interface EventsPageProps {
  role?: 'student' | 'admin'
}

export function EventsPage({ role = 'student' }: EventsPageProps) {
  const [eventsCount, setEventsCount] = useState(MOCK_EVENTS_COUNT)
  const [weekDays, setWeekDays] = useState<EventWeekDay[]>(MOCK_EVENTS_WEEK)
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent>(MOCK_FEATURED_EVENT)
  const [events, setEvents] = useState<EventListItem[]>(MOCK_EVENTS)

  useEffect(() => {
    let active = true

    const today = new Date()
    const from = new Date(today)
    from.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const to = new Date(from)
    to.setDate(from.getDate() + 6)

    const toISO = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const load = async () => {
      const data = await getEvents(toISO(from), toISO(to))
      if (!data || !active) return

      const mapped = mapApiEventsToEventsView(data)
      setEventsCount(mapped.count)
      setWeekDays(mapped.weekDays)
      setFeaturedEvent(mapped.featured)
      setEvents(mapped.list)
    }

    load().catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  const reload = () => {
    const today = new Date()
    const from = new Date(today)
    from.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const to = new Date(from)
    to.setDate(from.getDate() + 6)
    const toISO = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    getEvents(toISO(from), toISO(to))
      .then((data) => {
        if (!data) return
        const mapped = mapApiEventsToEventsView(data)
        setEventsCount(mapped.count)
        setWeekDays(mapped.weekDays)
        setFeaturedEvent(mapped.featured)
        setEvents(mapped.list)
      })
      .catch(() => undefined)
  }

  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-32 flex flex-col gap-4">
      <EventsOverview
        eventsCount={eventsCount}
        weekDays={weekDays}
        featuredEvent={featuredEvent}
      />
      {role === 'admin' && (
        <div className="rounded-2xl bg-white p-3 flex items-center gap-2">
          <button
            onClick={() => {
              createAdminEvent({
                title: 'Новая встреча',
                description: 'Создано из фронта',
                category: 'study',
                organizer: 'Админ',
                capacity: 20,
                space_id: 1,
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
              }).then(reload).catch(() => undefined)
            }}
            className="h-8 px-3 rounded-xl bg-[#eeedfc] text-brand-primary text-[13px] font-medium"
          >
            + Создать
          </button>
          <button
            onClick={() => {
              const first = events[0]
              if (!first?.eventId) return
              updateAdminEvent(first.eventId, {
                title: `${first.title} (апдейт)`,
                description: 'Изменено из фронта',
                category: 'study',
                organizer: 'Админ',
                capacity: 20,
                space_id: 1,
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
              }).then(reload).catch(() => undefined)
            }}
            className="h-8 px-3 rounded-xl bg-[#f4f4f8] text-brand-dark text-[13px] font-medium"
          >
            Изменить 1-е
          </button>
          <button
            onClick={() => {
              const first = events[0]
              if (!first?.eventId) return
              cancelAdminEvent(first.eventId).then(reload).catch(() => undefined)
            }}
            className="h-8 px-3 rounded-xl bg-[#f8f8fc] text-[#dd596c] text-[13px] font-medium"
          >
            Отменить 1-е
          </button>
        </div>
      )}
      <EventsList
        events={events}
        onRegister={(event) => {
          if (!event.eventId) return
          const call = event.isRegistered ? unregisterEvent(event.eventId) : registerEvent(event.eventId)
          call.then(reload).catch(() => undefined)
        }}
        onWaitlist={(event) => {
          if (!event.eventId) return
          const call = event.isSubscribed ? unsubscribeWaitlist(event.eventId) : subscribeWaitlist(event.eventId)
          call.then(reload).catch(() => undefined)
        }}
      />
    </main>
  )
}
