import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { scheduleApi } from '@/entities/schedule'
import { mapApiScheduleToView } from '@/shared/api/adapters'
import { routes } from '@/shared/config'
import { toISODate, weekRange } from '@/shared/lib/format'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { ScheduleGrid } from '@/widgets/schedule-grid'
import { ScheduleHeader } from '@/widgets/schedule-header'
export function SchedulePage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()))
  const range = viewMode === 'week' ? weekRange(selectedDate) : { from: selectedDate, to: selectedDate }
  const state = useAsyncData(() => scheduleApi.getSchedule(range.from, range.to), range.from + ':' + range.to)
  const view = mapApiScheduleToView(state.data)
  const book = (date = selectedDate, spaceId?: number, from?: string, to?: string) => {
    const params = new URLSearchParams({ date })
    if (spaceId) params.set('spaceId', String(spaceId))
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    navigate(routes.newBooking + '?' + params)
  }
  return <main className="page-shell schedule-page relative">
    <ScheduleHeader viewMode={viewMode} onViewModeChange={setViewMode} selectedDate={selectedDate} onDateChange={setSelectedDate} spaces={view.spaces} />
    {state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} onRetry={state.reload} /> : view.spaces.length ?
      <ScheduleGrid spaces={view.spaces} items={view.items} selectedDate={selectedDate} viewMode={viewMode} onSelectSlot={book} />
      : <EmptyState title="Нет доступных помещений" />}
    <button type="button" onClick={() => book()} aria-label="Новая заявка" className="floating-action"><Plus size={24} /></button>
  </main>
}
