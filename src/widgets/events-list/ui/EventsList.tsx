import type { EventListItem } from '@/entities/event'
export interface EventsListProps { events: EventListItem[] }
export function EventsList({ events }: EventsListProps) {
  return <>{events.map((event, index) => <section key={event.id} className="flex flex-col gap-2">{events[index - 1]?.dateLabel !== event.dateLabel && <h2 className="px-1 text-[14px] font-medium text-brand-muted">{event.dateLabel}</h2>}<article className="flex items-center gap-3 rounded-3xl bg-white p-4"><div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#eeedfc] text-brand-primary"><span className="text-[26px] font-extrabold leading-none">{event.day}</span><span className="mt-1 text-[12px] uppercase">{event.month}</span></div><div className="min-w-0"><h3 className="text-[16px] font-bold leading-tight">{event.title}</h3><p className="mt-1 text-[13px] text-brand-muted">{event.time}</p></div></article></section>)}</>
}
