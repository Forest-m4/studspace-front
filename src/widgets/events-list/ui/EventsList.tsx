import type { EventListItem } from '@/entities/event'

export interface EventsListProps {
  events: EventListItem[]
  onRegister?: (event: EventListItem) => void
  onWaitlist?: (event: EventListItem) => void
}

export function EventsList({ events, onRegister, onWaitlist }: EventsListProps) {
  return (
    <>
      {events.map((event) => (
        <section key={event.id} className="flex flex-col gap-2">
          <p className="text-[17px] leading-none text-brand-muted font-medium">{event.dateLabel}</p>
          <article className="rounded-3xl bg-white p-4 flex items-center gap-3">
            <div className="h-20 w-20 rounded-2xl bg-[#edeefe] text-brand-primary flex flex-col items-center justify-center shrink-0">
              <span className="text-[34px] leading-none font-extrabold tracking-[-0.02em]">{event.day}</span>
              <span className="text-[18px] leading-none font-semibold uppercase">{event.month}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-[17px] leading-[1.2] font-bold text-brand-dark break-words">{event.title}</h2>
              <p className="mt-1 text-[14px] leading-none text-brand-muted font-medium">{event.time}</p>
              {(event.state === 'available' || event.state === 'few_left' || event.state === 'full' || event.state === 'registered') && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => onRegister?.(event)}
                    className="h-8 px-3 rounded-xl bg-[#eeedfc] text-brand-primary text-[13px] font-medium"
                  >
                    {event.isRegistered ? 'Отменить запись' : 'Записаться'}
                  </button>
                  {(event.state === 'full' || event.isSubscribed) && (
                    <button
                      onClick={() => onWaitlist?.(event)}
                      className="h-8 px-3 rounded-xl bg-[#f4f4f8] text-brand-dark text-[13px] font-medium"
                    >
                      {event.isSubscribed ? 'Выйти из листа' : 'Лист ожидания'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </article>
        </section>
      ))}
    </>
  )
}
