import { MOCK_SCHEDULE_SPACES } from '@/entities/schedule';

interface Props {
  viewMode: 'day' | 'week';
  onViewModeChange: (mode: 'day' | 'week') => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function ScheduleHeader({ viewMode, onViewModeChange, selectedDate, onDateChange }: Props) {
  const days = [
    { label: 'Пн', date: '12', fullDate: '2026-10-12' },
    { label: 'Вт', date: '13', fullDate: '2026-10-13' },
    { label: 'Ср', date: '14', fullDate: '2026-10-14' },
    { label: 'Чт', date: '15', fullDate: '2026-10-15' },
    { label: 'Пт', date: '16', fullDate: '2026-10-16' },
    { label: 'Сб', date: '17', fullDate: '2026-10-17' },
    { label: 'Вс', date: '18', fullDate: '2026-10-18' },
  ];

  return (
    <div className="bg-white sticky top-0 z-30 shadow-sm pb-2">
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Октябрь 2026</h1>
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

      <div className="flex justify-between px-4 text-center mt-2">
        {days.map((day) => {
          const isActive = day.fullDate === selectedDate;
          return (
            <button 
              key={day.fullDate} 
              onClick={() => onDateChange(day.fullDate)}
              className={`flex flex-col items-center gap-1 w-8 ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}
            >
              <span className="text-xs">{day.label}</span>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-indigo-600 text-white' : ''}`}>
                {day.date}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex mt-4 border-b border-gray-100 px-16">
        {MOCK_SCHEDULE_SPACES.map((space) => (
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
  );
}