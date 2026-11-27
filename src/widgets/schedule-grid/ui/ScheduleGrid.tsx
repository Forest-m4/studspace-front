import { useEffect, useState } from 'react'
import { BookingItem } from '@/entities/booking'
import type { Booking, ScheduleSpace } from '@/entities/schedule'
import { formatTime, shiftDate, toISODate, weekRange } from '@/shared/lib/format'
interface Props { spaces: ScheduleSpace[]; items: Booking[]; selectedDate: string; viewMode: 'day' | 'week'; onSelectSlot: (date: string, spaceId: number, from: string, to: string) => void }
const START = 8, END = 22, HEIGHT = 60
export function ScheduleGrid({ spaces, items, selectedDate, viewMode, onSelectSlot }: Props) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer) }, [])
  const dates = viewMode === 'day' ? [selectedDate] : Array.from({ length: 7 }, (_, i) => shiftDate(weekRange(selectedDate).from, i))
  const columns = dates.flatMap(date => spaces.map(space => ({ date, space })))
  const hours = Array.from({ length: END - START + 1 }, (_, index) => START + index)
  const clock = (minutes: number) => String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0')
  const minutes = (value: string) => { const parts = formatTime(value).split(':').map(Number); return parts[0] * 60 + parts[1] }
  const currentMinute = minutes(now.toISOString())
  return <div className="schedule-scroll rounded-3xl bg-white">
    <div className="relative grid" style={{ gridTemplateColumns: '44px repeat(' + columns.length + ', minmax(' + (viewMode === 'week' ? '124px' : '0') + ', 1fr))', minWidth: viewMode === 'week' ? 44 + columns.length * 124 : undefined }}>
      <div className="sticky left-0 top-0 z-40 bg-white" />
      {columns.map(({ date, space }) => <div key={date + ':' + space.id} className="sticky top-0 z-30 border-b border-l border-brand-border bg-white px-2 py-3">
        {viewMode === 'week' && <p className="mb-1 text-[12px] font-bold">{formatDateLabelShort(date)}</p>}
        <p className="text-[12px] font-semibold"><span className="mr-1 inline-block size-2 rounded-full" style={{ background: space.color }} />{space.name}</p><p className="text-[11px] text-brand-muted">до {space.capacity} чел.</p>
      </div>)}
      <div className="sticky left-0 z-20 bg-white" style={{ height: (END - START) * HEIGHT }}>{hours.map(hour => <span key={hour} className="absolute right-2 text-[10px] text-brand-muted" style={{ top: Math.max(0, (hour - START) * HEIGHT - 6) }}>{hour}:00</span>)}</div>
      {columns.map(({ date, space }) => {
        const dayItems = items.filter(item => item.spaceId === space.id && toISODate(new Date(item.startTime)) === date)
        return <div key={date + ':' + space.id} className="relative border-l border-brand-border" style={{ height: (END - START) * HEIGHT }}>
          {Array.from({ length: (END - START) * 2 }, (_, i) => {
            const from = START * 60 + i * 30, to = from + 30
            const start = Date.parse(date + 'T' + clock(from) + ':00+03:00'), end = Date.parse(date + 'T' + clock(to) + ':00+03:00')
            const blocked = dayItems.some(item => item.status === 'approved' && start < Date.parse(item.endTime) && end > Date.parse(item.startTime))
            return <button key={i} disabled={blocked || start <= now.getTime()} aria-label={'Забронировать ' + space.name + ', ' + date + ', ' + clock(from) + '–' + clock(to)}
              onClick={() => onSelectSlot(date, space.id, clock(from), clock(to))}
              className="schedule-slot absolute left-0 w-full border-b border-brand-border/70 text-[11px] text-brand-primary"
              style={{ top: i * HEIGHT / 2, height: HEIGHT / 2 }}><span>+ Забронировать</span></button>
          })}
          {dayItems.map(item => {
            const top = (minutes(item.startTime) - START * 60) / 60 * HEIGHT
            const height = (minutes(item.endTime) - minutes(item.startTime)) / 60 * HEIGHT
            if (top >= (END - START) * HEIGHT || top + height <= 0) return null
            return <div key={item.id} className="pointer-events-none absolute left-[3%] z-10 w-[94%]" style={{ top: Math.max(0, top), height: Math.max(24, Math.min(height + Math.min(0, top), (END - START) * HEIGHT - Math.max(0, top)) - 3) }}><BookingItem item={item} variant="grid" /></div>
          })}
          {date === toISODate(now) && currentMinute >= START * 60 && currentMinute <= END * 60 && <div aria-label="Текущее время" className="pointer-events-none absolute left-0 right-0 z-20 border-t-2 border-brand-primary" style={{ top: (currentMinute / 60 - START) * HEIGHT }} />}
        </div>
      })}
    </div>
  </div>
}
function formatDateLabelShort(date: string) {
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(date + 'T12:00:00+03:00'))
}
