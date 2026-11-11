import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { MOCK_SCHEDULE_ITEMS, MOCK_SCHEDULE_SPACES, scheduleApi } from '@/entities/schedule'
import type { Booking, ScheduleSpace } from '@/entities/schedule'
import { mapApiScheduleToView } from '@/shared/api/adapters'
import { routes } from '@/shared/config'
import { ScheduleGrid } from '@/widgets/schedule-grid'
import { ScheduleHeader } from '@/widgets/schedule-header'

export interface SchedulePageProps {
  onCreateBooking?: () => void
}

export function SchedulePage({ onCreateBooking }: SchedulePageProps) {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-10-16')
  const [spaces, setSpaces] = useState<ScheduleSpace[]>(MOCK_SCHEDULE_SPACES)
  const [items, setItems] = useState<Booking[]>(MOCK_SCHEDULE_ITEMS)

  useEffect(() => {
    scheduleApi
      .getSchedule(selectedDate, selectedDate)
      .then((data) => {
        if (!data) return
        const mapped = mapApiScheduleToView(data)
        if (mapped.spaces.length > 0) {
          setSpaces(mapped.spaces)
        }
        setItems(mapped.items)
      })
      .catch(() => undefined)
  }, [selectedDate])

  const handleCreateBooking = () => {
    if (onCreateBooking) {
      onCreateBooking()
      return
    }
    navigate(routes.newBooking)
  }

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
        type="button"
        onClick={handleCreateBooking}
        className="absolute bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
