import type { EventWeekDay, FeaturedEvent } from '@/entities/event'

export interface EventsOverviewProps {
  eventsCount: number
  weekDays: EventWeekDay[]
  featuredEvent: FeaturedEvent
}

export function EventsOverview({ eventsCount, weekDays, featuredEvent }: EventsOverviewProps) {
  return (
    <section className="flex flex-col gap-4 bg-[#f5f5f8] rounded-3xl border border-white/65 p-4">
      <header>
        <h1 className="text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-dark">Мероприятия</h1>
        <p className="mt-2 text-[18px] leading-[1.2] text-brand-muted font-medium">{eventsCount} событий на этой неделе</p>
      </header>

      <article className="rounded-3xl px-5 py-5 text-white relative overflow-hidden bg-[linear-gradient(150deg,#6867e9_0%,#6a6be6_45%,#6867e9_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(152deg,transparent_35%,rgba(255,255,255,0.18)_35%,rgba(255,255,255,0.18)_52%,transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(153deg,transparent_53%,rgba(255,255,255,0.12)_53%,rgba(255,255,255,0.12)_71%,transparent_71%)]" />
        <div className="relative">
          <span className="inline-flex items-center bg-brand-accent text-brand-dark text-[16px] leading-none font-extrabold px-4 py-2 rounded-full">
            {featuredEvent.badge}
          </span>
          <p className="mt-5 text-[48px] leading-none font-extrabold tracking-[-0.03em]">
            {featuredEvent.startTime} <span className="text-[34px] text-white/75 font-semibold">- {featuredEvent.endTime}</span>
          </p>
          <p className="mt-4 text-[24px] leading-[1.15] font-bold tracking-[-0.01em]">{featuredEvent.title}</p>
        </div>
      </article>

      <div className="bg-white rounded-3xl px-4 py-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((item) => (
            <div key={`${item.short}-${item.day}`} className="text-center">
              <p className="text-[13px] font-medium text-brand-muted">{item.short}</p>
              <div className="mt-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[24px] leading-none font-semibold ${
                    item.active ? 'bg-brand-primary text-white' : 'text-brand-dark'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
