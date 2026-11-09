import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ScheduleSpace } from '@/entities/schedule'

interface Props {
  viewMode: 'day' | 'week'
  onViewModeChange: (mode: 'day' | 'week') => void
  selectedDate: string
  onDateChange: (date: string) => void
  spaces: ScheduleSpace[]
}

export function ScheduleHeader({ viewMode, onViewModeChange, selectedDate, onDateChange, spaces }: Props) {
  const toISO = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const touchStartX = useRef<number | null>(null)

  const selected = new Date(`${selectedDate}T00:00:00`)
  const weekdayIndex = (selected.getDay() + 6) % 7
  const monday = new Date(selected)
  monday.setDate(selected.getDate() - weekdayIndex)

  const monthTitle = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(selected)

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)

    return {
      label: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(day).replace('.', ''),
      date: String(day.getDate()),
      fullDate: toISO(day),
    }
  })

  const shiftWeek = (direction: -1 | 1) => {
    const next = new Date(selected)
    next.setDate(selected.getDate() + direction * 7)
    onDateChange(toISO(next))
  }

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX
  }

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return
    const delta = clientX - touchStartX.current
    touchStartX.current = null

    if (Math.abs(delta) < 40) return
    if (delta < 0) shiftWeek(1)
    if (delta > 0) shiftWeek(-1)
  }

  return (
    <div className="bg-white sticky top-0 z-30 shadow-sm pb-2">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="inline-flex items-center gap-2">
          <button
            onClick={() => shiftWeek(-1)}
            className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 inline-flex items-center justify-center"
            aria-label="Предыдущая неделя"
          >
            <ChevronLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1)}</h1>
          <button
            onClick={() => shiftWeek(1)}
            className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 inline-flex items-center justify-center"
            aria-label="Следующая неделя"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('day')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            День
          </button>
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            Неделя
          </button>
        </div>
      </div>

      <div
        className="flex justify-between px-4 text-center mt-2 touch-pan-y"
        onTouchStart={(event) => onTouchStart(event.touches[0]?.clientX ?? 0)}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        {days.map((day) => {
          const isActive = day.fullDate === selectedDate
          return (
            <button
              key={day.fullDate}
              onClick={() => onDateChange(day.fullDate)}
              className={`flex flex-col items-center gap-1 w-8 ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}
            >
              <span className="text-xs">{day.label.charAt(0).toUpperCase() + day.label.slice(1)}</span>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-indigo-600 text-white' : ''}`}>
                {day.date}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex mt-4 border-b border-gray-100 px-16">
        {spaces.map((space) => (
          <div key={space.id} className="flex-1 flex items-center gap-2 py-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: space.color }} />
            <div>
              <div className="text-sm font-semibold text-gray-800">{space.name}</div>
              <div className="text-[10px] text-gray-400">до {space.capacity} чел.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
