import type { EventListItem } from '@/entities/event'
import { ChevronRight } from 'lucide-react'
export interface EventsListProps { events: EventListItem[]; onSelect: (event: EventListItem) => void }
export function EventsList({ events, onSelect }: EventsListProps) {
  return <>{events.map((event, index) => <section key={event.id} className="flex flex-col gap-2">
    {events[index - 1]?.dateLabel !== event.dateLabel && <h2 className="px-1 text-[14px] font-medium text-brand-muted">{event.dateLabel}</h2>}
    <article><button type="button" aria-label={'Открыть мероприятие «' + event.title + '»'} onClick={() => onSelect(event)} className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left hover:bg-[#fafaff]">
      <span className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#eeedfc] text-brand-primary"><span className="text-[26px] font-extrabold leading-none">{event.day}</span><span className="mt-1 text-[12px] uppercase">{event.month}</span></span>
      <span className="min-w-0 flex-1"><span className="block break-words text-[16px] font-bold leading-tight">{event.title}</span><span className="mt-1 block text-[13px] text-brand-muted">{event.time}</span></span>
      <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-brand-muted" />
    </button></article>
  </section>)}</>
}
