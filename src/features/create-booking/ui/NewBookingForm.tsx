import { CalendarDays, ChevronDown, Minus, Plus, X } from 'lucide-react'
import type { BookingSpaceOption, NewBookingDraft } from '@/entities/booking-draft'
import { cn } from '@/shared/lib'
import { ErrorState } from '@/shared/ui/async-state/AsyncState'

export interface NewBookingFormProps {
  spaceOptions: BookingSpaceOption[]; draft: NewBookingDraft; onChange: (next: NewBookingDraft) => void
  onOpenDatePicker: () => void; onSubmit: () => void; onClose: () => void
  fields?: Record<string, string>; error?: string; busy?: boolean; unavailable?: boolean
  availabilityText?: string; stepMinutes?: number; reschedule?: boolean
}
export function NewBookingForm({ spaceOptions, draft, onChange, onOpenDatePicker, onSubmit, onClose,
  fields = {}, error, busy, unavailable, availabilityText, stepMinutes = 30, reschedule }: NewBookingFormProps) {
  const fieldError = (name: string) => fields[name] ? <p id={'error-' + name} className="field-error" role="alert">{fields[name]}</p> : null
  const change = (patch: Partial<NewBookingDraft>) => onChange({ ...draft, ...patch })
  return <main className="page-shell form-page">
    <header className="flex items-center justify-between">
      <h1 className="text-[20px] font-bold">{reschedule ? 'Перенести бронь' : 'Новая бронь'}</h1>
      <button type="button" onClick={onClose} disabled={busy} aria-label="Закрыть" className="icon-button"><X size={18} /></button>
    </header>
    <form className="mt-4 flex flex-col gap-4" onSubmit={event => { event.preventDefault(); onSubmit() }} noValidate aria-busy={busy}>
      <fieldset disabled={busy} className="flex flex-col gap-2">
        <legend className="field-label mb-2">Помещение</legend>
        <div className="grid grid-cols-2 gap-3">{spaceOptions.map(option => {
          const capacity = Number(option.capacityLabel.match(/\d+/)?.[0] ?? 0)
          return <button key={option.id} type="button" aria-pressed={draft.spaceId === option.id}
            onClick={() => change({ spaceId: option.id, peopleLimit: capacity, peopleCount: reschedule ? draft.peopleCount : Math.min(draft.peopleCount, capacity), fromTime: '', toTime: '' })}
            className={cn('rounded-2xl border px-3 py-3 text-left', draft.spaceId === option.id ? 'border-2 border-brand-primary bg-[#eeedfc]' : 'border-brand-border bg-[#f4f4f8]')}>
            <span className="flex items-center gap-2 text-[15px] font-semibold"><span className={cn('size-2 shrink-0 rounded-full', option.color === 'lime' ? 'bg-[#b8d415]' : 'bg-brand-primary')} />{option.name}</span>
            <span className="mt-1 block text-[13px] text-brand-muted">{option.capacityLabel}</span>
          </button>
        })}</div>{fieldError('space_id')}
      </fieldset>
      <label className="field-label">Имя и фамилия<input className="field-input mt-2" aria-label="Имя и фамилия" value={draft.fullName} readOnly /><span className="mt-1 block text-[12px] text-brand-muted">Из профиля ВКонтакте</span></label>
      <div><p className="field-label mb-2">Дата</p><button type="button" disabled={busy} onClick={onOpenDatePicker} className="field-input flex items-center justify-between text-left"><span className="flex items-center gap-2"><CalendarDays size={17} />{draft.dateLabel}</span><ChevronDown size={17} /></button></div>
      <div className="grid grid-cols-2 gap-3">
        <label className="field-label">С<input className="field-input mt-2" aria-invalid={Boolean(fields.starts_at)} aria-describedby={fields.starts_at ? 'error-starts_at' : undefined} type="time" required step={stepMinutes * 60} value={draft.fromTime} disabled={busy} onChange={event => change({ fromTime: event.target.value })} />{fieldError('starts_at')}</label>
        <label className="field-label">До<input className="field-input mt-2" aria-invalid={Boolean(fields.ends_at)} aria-describedby={fields.ends_at ? 'error-ends_at' : undefined} type="time" required step={stepMinutes * 60} value={draft.toTime} disabled={busy} onChange={event => change({ toTime: event.target.value })} />{fieldError('ends_at')}</label>
      </div>
      {availabilityText && <p className="text-[12px] text-brand-muted" role="status">{availabilityText}</p>}
      <label className="field-label">Название мероприятия<input className="field-input mt-2" aria-label="Название мероприятия" value={draft.eventTitle} maxLength={150} required readOnly={reschedule} disabled={busy} aria-invalid={Boolean(fields.title)} aria-describedby={fields.title ? 'error-title' : undefined} onChange={event => change({ eventTitle: event.target.value })} />{fieldError('title')}</label>
      <label className="field-label">Для чего<textarea aria-label="Для чего" className="field-input mt-2 min-h-28 resize-y py-3" value={draft.purpose} maxLength={150} required readOnly={reschedule} disabled={busy} aria-invalid={Boolean(fields.purpose)} aria-describedby={fields.purpose ? 'error-purpose' : undefined} onChange={event => change({ purpose: event.target.value })} /><span className="mt-1 block text-right text-[12px] text-brand-muted">{[...draft.purpose].length} / 150</span>{fieldError('purpose')}</label>
      <div><p className="field-label mb-2">Сколько человек</p><div className="flex items-center gap-3">
        <div className="flex h-11 items-center gap-2 rounded-xl bg-[#f4f4f8] px-2">
          <button type="button" aria-label="Меньше человек" disabled={busy || reschedule || draft.peopleCount <= 1} onClick={() => change({ peopleCount: draft.peopleCount - 1 })} className="counter-button"><Minus size={15} /></button>
          <output aria-label="Количество человек" className="w-7 text-center font-semibold">{draft.peopleCount}</output>
          <button type="button" aria-label="Больше человек" disabled={busy || reschedule || draft.peopleCount >= draft.peopleLimit} onClick={() => change({ peopleCount: draft.peopleCount + 1 })} className="counter-button"><Plus size={15} /></button>
        </div><span className="text-[13px] text-brand-muted">максимум {draft.peopleLimit}</span>
      </div>{fieldError('people_count')}</div>
      {reschedule && <p className="text-[13px] text-brand-muted">Прежняя бронь сохранится, пока администратор не одобрит перенос.</p>}
      {error && <ErrorState message={error} />}
      <button type="submit" disabled={busy || unavailable} className="primary-action mt-2">{busy ? 'Отправляем…' : reschedule ? 'Отправить заявку на перенос' : 'Отправить заявку'}</button>
    </form>
  </main>
}
