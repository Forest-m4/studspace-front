import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { eventApi } from '@/entities/event'
import type { EventListItem } from '@/entities/event'
import { formatDateLabel, formatTime, shiftDate, toISODate, weekRange } from '@/shared/lib/format'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { EventsList } from '@/widgets/events-list'
import { EventsOverview } from '@/widgets/events-overview'
export function EventsPage() {
  const [date, setDate] = useState(() => toISODate(new Date()))
  const [filter, setFilter] = useState(false)
  const range = weekRange(date)
  const state = useAsyncData(() => eventApi.getEvents(range.from, range.to), range.from + ':' + range.to)
  const source = [...(state.data?.items ?? [])].sort((a, b) => Date.parse(a.starts_at!) - Date.parse(b.starts_at!))
  const list: EventListItem[] = source.filter(item => !filter || toISODate(new Date(item.starts_at!)) === date).map(item => {
    const day = toISODate(new Date(item.starts_at!))
    return { id: String(item.booking_id), dateLabel: formatDateLabel(item.starts_at), day: String(Number(day.slice(8))), month: new Intl.DateTimeFormat('ru-RU', { month: 'short', timeZone: 'Europe/Moscow' }).format(new Date(item.starts_at!)).replace('.', ''), title: item.title ?? '', time: formatTime(item.starts_at) + '–' + formatTime(item.ends_at) }
  })
  const featured = state.data?.featured
  return <main className="page-shell flex flex-col gap-4">
    <div className="flex justify-end gap-2"><button aria-label="Предыдущая неделя" className="icon-button" onClick={() => { setDate(shiftDate(date, -7)); setFilter(false) }}><ChevronLeft size={18} /></button><button className="text-[13px] text-brand-primary" onClick={() => { setDate(toISODate(new Date())); setFilter(false) }}>Эта неделя</button><button aria-label="Следующая неделя" className="icon-button" onClick={() => { setDate(shiftDate(date, 7)); setFilter(false) }}><ChevronRight size={18} /></button></div>
    <EventsOverview eventsCount={state.data?.week_total ?? 0} weekDays={Array.from({ length: 7 }, (_, i) => {
      const iso = shiftDate(range.from, i)
      return { short: new Intl.DateTimeFormat('ru-RU', { weekday: 'short', timeZone: 'Europe/Moscow' }).format(new Date(iso + 'T12:00:00+03:00')), day: Number(iso.slice(8)), active: iso === date }
    })} onDaySelect={index => { setDate(shiftDate(range.from, index)); setFilter(true) }} featuredEvent={featured ? { badge: 'Сегодня', title: featured.title ?? '', startTime: formatTime(featured.starts_at), endTime: formatTime(featured.ends_at) } : undefined} />
    {filter && <button className="self-start text-[13px] text-brand-primary" onClick={() => setFilter(false)}>Показать всю неделю</button>}
    {state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} onRetry={state.reload} /> : list.length ? <EventsList events={list} /> : <EmptyState title="Событий пока нет" text={filter ? 'В выбранный день нет мероприятий.' : 'На этой неделе нет одобренных броней.'} />}
  </main>
}
