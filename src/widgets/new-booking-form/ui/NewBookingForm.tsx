import { CalendarDays, ChevronDown, Clock3, Minus, Plus, X } from 'lucide-react'
import {
  BOOKING_PURPOSE_LIMIT,
  BOOKING_SPACE_OPTIONS,
  BOOKING_TIME_WARNING,
} from '@/entities/booking-draft'
import type { NewBookingDraft } from '@/entities/booking-draft'

export interface NewBookingFormProps {
  draft: NewBookingDraft
  onChange: (next: NewBookingDraft) => void
  onClose: () => void
}

function FieldLabel({ children }: { children: string }) {
  return <p className="text-[13px] text-brand-dark font-medium">{children}</p>
}

export function NewBookingForm({ draft, onChange, onClose }: NewBookingFormProps) {
  const purposeLength = draft.purpose.length

  const handlePeopleChange = (delta: number) => {
    const nextCount = Math.max(1, Math.min(draft.peopleLimit, draft.peopleCount + delta))
    onChange({ ...draft, peopleCount: nextCount })
  }

  return (
    <main className="max-w-160 w-full mx-auto px-4 pt-4 pb-30 flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-[34px] leading-none font-bold text-brand-dark">Новая бронь</h1>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-full bg-[#f2f2f8] text-brand-muted inline-flex items-center justify-center hover:bg-[#ececf3] transition-colors"
          aria-label="Закрыть"
        >
          <X size={16} />
        </button>
      </header>

      <section className="flex flex-col gap-3">
        <FieldLabel>Помещение</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {BOOKING_SPACE_OPTIONS.map((option) => {
            const isActive = draft.spaceId === option.id
            const dotColor = option.color === 'violet' ? 'bg-[#6f6eea]' : 'bg-[#b8d415]'

            return (
              <button
                key={option.id}
                onClick={() => onChange({ ...draft, spaceId: option.id })}
                className={`rounded-2xl border px-3 py-2 text-left transition-colors ${
                  isActive
                    ? 'border-brand-primary bg-[#f6f6ff]'
                    : 'border-[#ececf3] bg-white hover:bg-[#fbfbff]'
                }`}
              >
                <p className="text-[18px] text-brand-dark font-medium inline-flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                  {option.name}
                </p>
                <p className="mt-1 text-[13px] text-brand-muted">{option.capacityLabel}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <FieldLabel>Имя и фамилия</FieldLabel>
        <input
          value={draft.fullName}
          onChange={(event) => onChange({ ...draft, fullName: event.target.value })}
          className="h-11 rounded-xl bg-[#f4f4f8] px-3 text-[18px] text-brand-dark outline-none border border-transparent focus:border-[#cbcaf5]"
        />
        <p className="text-[13px] text-brand-muted">Из профиля ВКонтакте</p>
      </section>

      <section className="flex flex-col gap-3">
        <FieldLabel>Дата</FieldLabel>
        <button className="h-11 rounded-xl bg-[#f4f4f8] px-3 text-[18px] text-brand-dark inline-flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={15} className="text-brand-muted" />
            {draft.dateLabel}
          </span>
          <ChevronDown size={15} className="text-brand-muted" />
        </button>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <FieldLabel>С</FieldLabel>
          <button className="h-11 rounded-xl bg-[#f4f4f8] px-3 text-[18px] text-brand-dark inline-flex items-center gap-2">
            <Clock3 size={15} className="text-brand-muted" />
            {draft.fromTime}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>До</FieldLabel>
          <button className="h-11 rounded-xl bg-[#f4f4f8] px-3 text-[18px] text-brand-dark inline-flex items-center gap-2">
            <Clock3 size={15} className="text-brand-muted" />
            {draft.toTime}
          </button>
        </div>
      </section>

      <p className="text-[12px] text-brand-muted inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b8d415]" />
        {BOOKING_TIME_WARNING}
      </p>

      <section className="flex flex-col gap-3">
        <FieldLabel>Название мероприятия</FieldLabel>
        <input
          value={draft.eventTitle}
          onChange={(event) => onChange({ ...draft, eventTitle: event.target.value })}
          className="h-11 rounded-xl bg-[#f4f4f8] px-3 text-[18px] text-brand-dark outline-none border border-transparent focus:border-[#cbcaf5]"
        />
      </section>

      <section className="flex flex-col gap-3">
        <FieldLabel>Для чего</FieldLabel>
        <div className="rounded-xl bg-[#f4f4f8] border border-transparent focus-within:border-[#cbcaf5] px-3 py-2">
          <textarea
            value={draft.purpose}
            onChange={(event) => onChange({ ...draft, purpose: event.target.value.slice(0, BOOKING_PURPOSE_LIMIT) })}
            className="w-full min-h-16 resize-none bg-transparent text-[18px] text-brand-dark outline-none"
          />
          <p className="text-[12px] text-brand-muted text-right">
            {purposeLength} / {BOOKING_PURPOSE_LIMIT}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <FieldLabel>Сколько человек</FieldLabel>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#f4f4f8] h-10 px-2 inline-flex items-center gap-2">
            <button
              onClick={() => handlePeopleChange(-1)}
              className="h-6 w-6 rounded-md bg-white text-brand-dark inline-flex items-center justify-center"
            >
              <Minus size={13} />
            </button>
            <span className="text-[18px] w-6 text-center text-brand-dark">{draft.peopleCount}</span>
            <button
              onClick={() => handlePeopleChange(1)}
              className="h-6 w-6 rounded-md bg-white text-brand-dark inline-flex items-center justify-center"
            >
              <Plus size={13} />
            </button>
          </div>
          <span className="text-[13px] text-brand-muted">максимум {draft.peopleLimit}</span>
        </div>
      </section>

      <button className="mt-3 h-12 rounded-2xl bg-brand-accent text-brand-dark text-[16px] font-semibold hover:bg-[#c8eb09] transition-colors">
        Отправить заявку
      </button>
    </main>
  )
}
