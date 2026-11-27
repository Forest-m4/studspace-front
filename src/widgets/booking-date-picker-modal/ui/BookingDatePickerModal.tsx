import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getBusyDays } from '@/shared/api/studspace'
import { shiftDate, weekRange } from '@/shared/lib/format'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { ErrorState } from '@/shared/ui/async-state/AsyncState'
import { Modal } from '@/shared/ui/modal/Modal'
export interface BookingDatePickerModalProps { selectedDateISO: string; minDateISO?: string; onClose: () => void; onSelect: (date: string) => void }
export function BookingDatePickerModal({ selectedDateISO, minDateISO, onClose, onSelect }: BookingDatePickerModalProps) {
  const [month, setMonth] = useState(selectedDateISO.slice(0, 7))
  const [selected, setSelected] = useState(selectedDateISO)
  const result = useAsyncData(() => getBusyDays(month), month)
  const start = weekRange(month + '-01').from
  const days = Array.from({ length: 42 }, (_, i) => shiftDate(start, i))
  const label = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'Europe/Moscow' }).format(new Date(month + '-01T12:00:00+03:00')).replace(' г.', '')
  const move = (direction: number) => {
    const date = new Date(month + '-01T12:00:00+03:00')
    date.setUTCMonth(date.getUTCMonth() + direction)
    setMonth(date.toISOString().slice(0, 7))
  }
  return <Modal title={label.charAt(0).toUpperCase() + label.slice(1)} onClose={onClose}>
    <div className="mb-4 flex justify-end gap-2"><button className="icon-button" aria-label="Предыдущий месяц" onClick={() => move(-1)}><ChevronLeft size={18} /></button><button className="icon-button" aria-label="Следующий месяц" onClick={() => move(1)}><ChevronRight size={18} /></button></div>
    <div className="grid grid-cols-7 gap-y-2">{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(day => <span key={day} className="text-center text-[12px] text-brand-muted">{day}</span>)}
      {days.map(date => <button key={date} type="button" aria-label={date} aria-pressed={date === selected} disabled={Boolean(minDateISO && date < minDateISO)}
        className={'calendar-day ' + (date === selected ? 'selected' : date.startsWith(month) ? '' : 'outside')}
        onClick={() => setSelected(date)}><span>{Number(date.slice(8))}</span>{result.data?.days?.includes(date) && <i className="calendar-dot" />}</button>)}
    </div>
    {result.loading && <p role="status" className="mt-3 text-[12px] text-brand-muted">Загружаем занятость…</p>}
    {result.error && <div className="mt-3"><ErrorState message={result.error} onRetry={result.reload} /></div>}
    <p className="mt-4 text-[12px] text-brand-muted">• есть брони</p>
    <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4"><button className="text-brand-muted" onClick={onClose}>Отмена</button><button className="primary-action px-7" onClick={() => onSelect(selected)} disabled={Boolean(minDateISO && selected < minDateISO)}>Выбрать</button></div>
  </Modal>
}
