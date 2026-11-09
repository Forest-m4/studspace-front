import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { MOCK_SCHEDULE_ITEMS, MOCK_SCHEDULE_SPACES } from '@/entities/schedule'
import type { Booking, ScheduleSpace } from '@/entities/schedule'
import { ScheduleHeader } from '@/widgets/schedule-header'
import { ScheduleGrid } from '@/widgets/schedule-grid'
import { mapApiScheduleToView } from '@/shared/api/adapters'
import { getSchedule } from '@/shared/api/studspace'

export interface SchedulePageProps {
  onCreateBooking?: () => void
}

export function SchedulePage({ onCreateBooking }: SchedulePageProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-10-16')
  const [spaces, setSpaces] = useState<ScheduleSpace[]>(MOCK_SCHEDULE_SPACES)
  const [items, setItems] = useState<Booking[]>(MOCK_SCHEDULE_ITEMS)

  useEffect(() => {
    let active = true

    const load = async () => {
      const data = await getSchedule(selectedDate, selectedDate)
      if (!active || !data) return

      const mapped = mapApiScheduleToView(data)
      if (mapped.spaces.length > 0) {
        setSpaces(mapped.spaces)
      }

      setItems(mapped.items)
    }

    load().catch(() => undefined)

    return () => {
      active = false
    }
  }, [selectedDate])

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      <ScheduleHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        spaces={spaces}
      />

      <ScheduleGrid spaces={spaces} items={items} />

      <button
        onClick={onCreateBooking}
        className="absolute bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
