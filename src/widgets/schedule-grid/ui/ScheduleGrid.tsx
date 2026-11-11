import { useMemo } from 'react'
import { BookingItem } from '@/entities/booking'
import { calculateItemPosition, END_HOUR, HOUR_HEIGHT, START_HOUR } from '@/entities/schedule'
import type { Booking, ScheduleSpace } from '@/entities/schedule'

interface Props {
  spaces: ScheduleSpace[]
  items: Booking[]
}

export function ScheduleGrid({ spaces, items }: Props) {
  const hours = useMemo(() => {
    const h = []
    for (let i = START_HOUR; i <= END_HOUR; i++) {
      h.push(`${i}:00`)
    }
    return h
  }, [])

  return (
    <div className="flex-1 overflow-auto bg-white relative">
      <div className="flex h-full">
        <div className="w-16 shrink-0 bg-white border-r border-gray-100 pt-4">
          {hours.map((hour) => (
            <div key={hour} style={{ height: HOUR_HEIGHT }} className="text-[11px] text-gray-400 text-right pr-2 -mt-2">
              {hour}
            </div>
          ))}
        </div>

        <div className="flex-1 flex relative">
          {spaces.map((space) => (
            <div key={space.id} className="flex-1 border-r border-gray-100 relative">
              {hours.map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="border-b border-gray-100/50" />
              ))}

              {items
                .filter((item) => item.spaceId === space.id)
                .map((item) => {
                  const { top, height } = calculateItemPosition(item)
                  return (
                    <div key={item.id} style={{ top: `${top}px`, height: `${height}px` }} className="absolute w-[95%] left-[2.5%] z-20">
                      <BookingItem item={item} variant="grid" />
                    </div>
                  )
                })}
            </div>
          ))}

          <div
            className="absolute left-0 right-0 border-t-2 border-indigo-500/85 z-10 pointer-events-none"
            style={{ top: `${(14 - START_HOUR) * HOUR_HEIGHT}px` }}
          >
            <div className="w-2 h-2 bg-indigo-500 rounded-full -mt-1.25 -ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
