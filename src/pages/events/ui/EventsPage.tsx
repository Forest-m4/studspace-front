const weekDays = [
  { short: 'Пн', day: 12 },
  { short: 'Вт', day: 13 },
  { short: 'Ср', day: 14 },
  { short: 'Чт', day: 15 },
  { short: 'Пт', day: 16, active: true },
  { short: 'Сб', day: 17 },
  { short: 'Вс', day: 18 },
]

const events = [
  {
    dateLabel: 'Вторник, 20 октября',
    day: '20',
    month: 'окт',
    title: 'Разбор задач олимпиады по программированию',
    time: '18:00-20:00',
  },
  {
    dateLabel: 'Среда, 21 октября',
    day: '21',
    month: 'окт',
    title: 'Встреча с выпускниками: карьера в IT',
    time: '17:00-19:00',
  },
  {
    dateLabel: 'Суббота, 24 октября',
    day: '24',
    month: 'окт',
    title: 'Игротека: настольные игры',
    time: '15:00-19:00',
  },
]

export function EventsPage() {
  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-5 pb-32 flex flex-col gap-4">
      <section className="flex flex-col gap-4 bg-[#f5f5f8] rounded-3xl border border-white/65 p-4">
        <header>
          <h1 className="text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-dark">Мероприятия</h1>
          <p className="mt-2 text-[18px] leading-[1.2] text-brand-muted font-medium">5 событий на этой неделе</p>
        </header>

        <article className="rounded-3xl px-5 py-5 text-white relative overflow-hidden bg-[linear-gradient(150deg,#6867e9_0%,#6a6be6_45%,#6867e9_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(152deg,transparent_35%,rgba(255,255,255,0.18)_35%,rgba(255,255,255,0.18)_52%,transparent_52%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(153deg,transparent_53%,rgba(255,255,255,0.12)_53%,rgba(255,255,255,0.12)_71%,transparent_71%)]" />
          <div className="relative">
            <span className="inline-flex items-center bg-brand-accent text-brand-dark text-[16px] leading-none font-extrabold px-4 py-2 rounded-full">
              Сегодня
            </span>
            <p className="mt-5 text-[48px] leading-none font-extrabold tracking-[-0.03em]">
              16:00 <span className="text-[34px] text-white/75 font-semibold">- 18:30</span>
            </p>
            <p className="mt-4 text-[24px] leading-[1.15] font-bold tracking-[-0.01em]">Мастер-класс по Figma</p>
          </div>
        </article>

        <div className="bg-white rounded-3xl px-4 py-4">
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((item) => (
              <div key={item.day} className="text-center">
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

      {events.map((event) => (
        <section key={event.title} className="flex flex-col gap-2">
          <p className="text-[17px] leading-none text-brand-muted font-medium">{event.dateLabel}</p>
          <article className="rounded-3xl bg-white p-4 flex items-center gap-3">
            <div className="h-20 w-20 rounded-2xl bg-[#edeefe] text-brand-primary flex flex-col items-center justify-center shrink-0">
              <span className="text-[34px] leading-none font-extrabold tracking-[-0.02em]">{event.day}</span>
              <span className="text-[18px] leading-none font-semibold uppercase">{event.month}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-[17px] leading-[1.2] font-bold text-brand-dark break-words">{event.title}</h2>
              <p className="mt-1 text-[14px] leading-none text-brand-muted font-medium">{event.time}</p>
            </div>
          </article>
        </section>
      ))}
    </main>
  )
}
