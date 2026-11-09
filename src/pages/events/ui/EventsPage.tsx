import {
  MOCK_EVENTS,
  MOCK_EVENTS_COUNT,
  MOCK_EVENTS_WEEK,
  MOCK_FEATURED_EVENT,
} from '@/entities/event'
import { EventsOverview } from '@/widgets/events-overview'
import { EventsList } from '@/widgets/events-list'

export function EventsPage() {
  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-32 flex flex-col gap-4">
      <EventsOverview
        eventsCount={MOCK_EVENTS_COUNT}
        weekDays={MOCK_EVENTS_WEEK}
        featuredEvent={MOCK_FEATURED_EVENT}
      />
      <EventsList events={MOCK_EVENTS} />
    </main>
  )
}
