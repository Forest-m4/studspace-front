import type { EventWeekDay, FeaturedEvent } from '@/entities/event'
export interface EventsOverviewProps { eventsCount: number; weekDays: EventWeekDay[]; featuredEvent?: FeaturedEvent; onDaySelect?: (index: number) => void; onFeaturedSelect: () => void }
export function EventsOverview({ eventsCount, weekDays, featuredEvent, onDaySelect, onFeaturedSelect }: EventsOverviewProps) {
  const plural = new Intl.PluralRules('ru-RU').select(eventsCount)
  const eventWord = plural === 'one' ? 'событие' : plural === 'few' ? 'события' : 'событий'
  return <section className="flex flex-col gap-5">
    <header><h1 className="text-[28px] font-extrabold">Мероприятия</h1><p className="mt-1 text-[14px] text-brand-muted">{eventsCount} {eventWord} на этой неделе</p></header>
    {featuredEvent && <article><button type="button" aria-label={'Открыть событие дня «' + featuredEvent.title + '»'} onClick={onFeaturedSelect} className="event-hero block w-full rounded-3xl px-5 py-5 text-left text-white"><span className="rounded-full bg-brand-accent px-3 py-1 text-[12px] font-bold text-brand-dark">{featuredEvent.badge}</span><span className="mt-5 block text-[56px] font-extrabold leading-none">{featuredEvent.startTime}<span className="ml-2 text-[20px] font-semibold text-white/75">– {featuredEvent.endTime}</span></span><span className="mt-4 block break-words text-[22px] font-bold leading-tight">{featuredEvent.title}</span></button></article>}
    <div className="grid grid-cols-7 gap-1 rounded-3xl bg-white px-3 py-4">{weekDays.map((item, index) => <button type="button" key={item.short} aria-pressed={item.active} aria-label={item.short + ', ' + item.day} onClick={() => onDaySelect?.(index)} className="flex flex-col items-center gap-2"><span className="text-[11px] text-brand-muted">{item.short}</span><span className={'flex size-9 items-center justify-center rounded-full text-[15px] font-semibold ' + (item.active ? 'bg-brand-primary text-white' : '')}>{item.day}</span></button>)}</div>
  </section>
}
