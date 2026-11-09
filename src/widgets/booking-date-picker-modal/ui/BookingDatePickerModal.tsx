import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface BookingDatePickerModalProps {
  selectedDateISO: string
  onClose: () => void
  onSelect: (nextDateISO: string) => void
}

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function monthTitle(date: Date) {
  const value = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date)
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const firstWeekday = (firstDay.getDay() + 6) % 7

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const result: { date: Date; outside: boolean }[] = []

  for (let i = 0; i < firstWeekday; i += 1) {
    result.push({ date: new Date(year, month - 1, daysInPrevMonth - firstWeekday + i + 1), outside: true })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    result.push({ date: new Date(year, month, day), outside: false })
  }

  while (result.length < 42) {
    const day = result.length - (firstWeekday + daysInMonth) + 1
    result.push({ date: new Date(year, month + 1, day), outside: true })
  }

  return result
}

export function BookingDatePickerModal({ selectedDateISO, onClose, onSelect }: BookingDatePickerModalProps) {
  const initialDate = new Date(`${selectedDateISO}T00:00:00`)
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  const [pendingDateISO, setPendingDateISO] = useState(selectedDateISO)

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth])
  const hasBookingsDots = new Set(['2026-10-16', '2026-10-19', '2026-10-23'])

  return (
    <div className="fixed inset-0 z-50 bg-black/25 flex items-start justify-center px-4 pt-14">
      <div className="max-w-160 w-full rounded-3xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[30px] leading-none font-bold text-brand-dark">{monthTitle(currentMonth)}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="h-8 w-8 rounded-full bg-[#f3f3f8] inline-flex items-center justify-center text-brand-dark"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="h-8 w-8 rounded-full bg-[#f3f3f8] inline-flex items-center justify-center text-brand-dark"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-y-2">
          {weekdays.map((day) => (
            <span key={day} className="text-center text-[12px] text-brand-muted">{day}</span>
          ))}

          {days.map(({ date, outside }) => {
            const iso = toISO(date)
            const selected = iso === pendingDateISO
            return (
              <button
                key={iso}
                onClick={() => setPendingDateISO(iso)}
                className={`h-9 flex flex-col items-center justify-center text-[15px] leading-none transition-colors ${
                  selected
                    ? 'text-white'
                    : outside
                      ? 'text-[#c6c4d4]'
                      : 'text-brand-dark hover:text-brand-primary'
                }`}
              >
                <span className={`h-8 w-8 rounded-full inline-flex items-center justify-center ${selected ? 'bg-brand-primary' : ''}`}>
                  {date.getDate()}
                </span>
                {hasBookingsDots.has(iso) && !outside && !selected && (
                  <span className="mt-1 h-1 w-1 rounded-full bg-brand-primary" />
                )}
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-[12px] text-brand-muted inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
          есть брони
        </p>

        <div className="mt-4 pt-3 border-t border-[#eeedf3] flex items-center justify-between">
          <button onClick={onClose} className="text-[16px] text-brand-muted hover:text-brand-dark transition-colors">
            Отмена
          </button>
          <button
            onClick={() => onSelect(pendingDateISO)}
            className="h-10 px-7 rounded-2xl bg-brand-accent text-brand-dark text-[16px] font-semibold hover:bg-[#c8eb09] transition-colors"
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  )
}
