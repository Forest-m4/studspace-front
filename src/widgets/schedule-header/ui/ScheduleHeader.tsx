import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ScheduleSpace } from '@/entities/schedule'
import { shiftDate, toISODate, weekRange } from '@/shared/lib/format'
interface Props { viewMode: 'day' | 'week'; onViewModeChange: (mode: 'day' | 'week') => void; selectedDate: string; onDateChange: (date: string) => void; spaces: ScheduleSpace[] }
export function ScheduleHeader({ viewMode, onViewModeChange, selectedDate, onDateChange }: Props) {
  const range = weekRange(selectedDate)
  const month = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', month: 'long', year: 'numeric' }).format(new Date(selectedDate + 'T12:00:00+03:00')).replace(' г.', '')
  return <header className="mb-4">
    <div className="flex items-center gap-2"><h1 className="mr-auto text-[24px] font-bold">{month.charAt(0).toUpperCase() + month.slice(1)}</h1>
      <button className="icon-button" aria-label="Предыдущая неделя" onClick={() => onDateChange(shiftDate(selectedDate, -7))}><ChevronLeft size={18} /></button>
      <button className="icon-button" aria-label="Следующая неделя" onClick={() => onDateChange(shiftDate(selectedDate, 7))}><ChevronRight size={18} /></button>
    </div>
    <div className="mt-3 flex items-center justify-between"><button className="text-[14px] font-semibold text-brand-primary" onClick={() => onDateChange(toISODate(new Date()))}>Сегодня</button>
      <div className="tab-list" aria-label="Вид расписания">{(['day','week'] as const).map(mode => <button key={mode} aria-pressed={viewMode === mode} className={viewMode === mode ? 'active' : ''} onClick={() => onViewModeChange(mode)}>{mode === 'day' ? 'День' : 'Неделя'}</button>)}</div>
    </div>
    <div className="mt-4 grid grid-cols-7 gap-1">{Array.from({ length: 7 }, (_, index) => {
      const date = shiftDate(range.from, index)
      const label = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', weekday: 'short' }).format(new Date(date + 'T12:00:00+03:00'))
      return <button key={date} className="flex flex-col items-center gap-1" aria-label={date} aria-pressed={selectedDate === date} onClick={() => onDateChange(date)}>
        <span className="text-[11px] text-brand-muted">{label}</span><span className={'flex size-9 items-center justify-center rounded-full text-[14px] font-semibold ' + (selectedDate === date ? 'bg-brand-primary text-white' : '')}>{Number(date.slice(8))}</span>
      </button>
    })}</div>
  </header>
}
