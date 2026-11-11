import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  eventApi,
  MOCK_EVENTS,
  MOCK_EVENTS_COUNT,
  MOCK_EVENTS_WEEK,
  MOCK_FEATURED_EVENT,
} from '@/entities/event'
import type { EventListItem, EventWeekDay, FeaturedEvent } from '@/entities/event'
import { mapApiEventsToEventsView } from '@/shared/api/adapters'
import { toISODate } from '@/shared/lib'
import { EventsList } from '@/widgets/events-list'
import { EventsOverview } from '@/widgets/events-overview'

export interface EventsPageProps {
  role?: 'student' | 'admin'
}

function getCurrentWeekRange() {
  const today = new Date()
  const from = new Date(today)
  from.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const to = new Date(from)
  to.setDate(from.getDate() + 6)
  return { from: toISODate(from), to: toISODate(to) }
}

export function EventsPage({ role }: EventsPageProps) {
  const context = useOutletContext<{ role?: 'student' | 'admin' } | undefined>()
  const currentRole = role ?? context?.role ?? 'student'
  const [eventsCount, setEventsCount] = useState(MOCK_EVENTS_COUNT)
  const [weekDays, setWeekDays] = useState<EventWeekDay[]>(MOCK_EVENTS_WEEK)
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent>(MOCK_FEATURED_EVENT)
  const [events, setEvents] = useState<EventListItem[]>(MOCK_EVENTS)

  const reload = () => {
    const { from, to } = getCurrentWeekRange()
    eventApi
      .getEvents(from, to)
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

  useEffect(() => {
    const { from, to } = getCurrentWeekRange()
    eventApi
      .getEvents(from, to)
      .then((data) => {
        if (!data) return
        const mapped = mapApiEventsToEventsView(data)
        setEventsCount(mapped.count)
        setWeekDays(mapped.weekDays)
        setFeaturedEvent(mapped.featured)
        setEvents(mapped.list)
      })
      .catch(() => undefined)
  }, [])

  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-32 flex flex-col gap-4">
      <EventsOverview
        eventsCount={eventsCount}
        weekDays={weekDays}
        featuredEvent={featuredEvent}
      />
      {currentRole === 'admin' && (
        <div className="rounded-2xl bg-white p-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              eventApi
                .createAdminEvent({
                  title: 'Новая встреча',
                  description: 'Создано из фронта',
                  category: 'study',
                  organizer: 'Админ',
                  capacity: 20,
                  space_id: 1,
                  starts_at: new Date().toISOString(),
                  ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                })
                .then(reload)
                .catch(() => undefined)
            }}
            className="h-8 px-3 rounded-xl bg-[#eeedfc] text-brand-primary text-[13px] font-medium"
          >
            + Создать
          </button>
          <button
            type="button"
            onClick={() => {
              const first = events[0]
              if (!first?.eventId) return
              eventApi
                .updateAdminEvent(first.eventId, {
                  title: `${first.title} (апдейт)`,
                  description: 'Изменено из фронта',
                  category: 'study',
                  organizer: 'Админ',
                  capacity: 20,
                  space_id: 1,
                  starts_at: new Date().toISOString(),
                  ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                })
                .then(reload)
                .catch(() => undefined)
            }}
            className="h-8 px-3 rounded-xl bg-[#f4f4f8] text-brand-dark text-[13px] font-medium"
          >
            Изменить 1-е
          </button>
          <button
            type="button"
            onClick={() => {
              const first = events[0]
              if (!first?.eventId) return
              eventApi.cancelAdminEvent(first.eventId).then(reload).catch(() => undefined)
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
          const call = event.isRegistered
            ? eventApi.unregisterEvent(event.eventId)
            : eventApi.registerEvent(event.eventId)
          call.then(reload).catch(() => undefined)
        }}
        onWaitlist={(event) => {
          if (!event.eventId) return
          const call = event.isSubscribed
            ? eventApi.unsubscribeWaitlist(event.eventId)
            : eventApi.subscribeWaitlist(event.eventId)
          call.then(reload).catch(() => undefined)
        }}
      />
    </main>
  )
}
