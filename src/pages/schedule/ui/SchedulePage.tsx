import { ScheduleGrid } from '@/widgets/schedule-grid';
import { MOCK_SCHEDULE_ITEMS, MOCK_SCHEDULE_SPACES } from '@/entities/schedule';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ScheduleHeader } from '@/widgets/schedule-header';

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState('2026-10-16');

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      <ScheduleHeader 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      
      <ScheduleGrid spaces={MOCK_SCHEDULE_SPACES} items={MOCK_SCHEDULE_ITEMS} />

      <button className="absolute bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-40">
        <Plus size={28} />
      </button>
    </div>
  );
}