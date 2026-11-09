import React from 'react';
import type { Booking } from '../model/types';
export interface BookingItemProps {
  item: Booking;
}

export const BookingItem: React.FC<BookingItemProps> = ({ item }) => {
  if (!item) return null; // <--- Защита от падения

  const isEvent = item?.type === 'event';
  const isCompleted = item?.type === 'booking' && item?.status === 'completed';
  
  const bgClass = isEvent 
    ? 'bg-purple-100 border-purple-300' 
    : isCompleted 
      ? 'bg-indigo-50 border-indigo-200 opacity-70' 
      : 'bg-[#f4f7d4] border-[#e2e8a0]';

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`absolute w-full rounded-md border-l-4 p-2 text-xs flex flex-col overflow-hidden shadow-sm ${bgClass}`}>
      <div className="font-semibold text-gray-800 leading-tight mb-1">
        {item?.title || 'Без названия'}
      </div>
      
      <div className="text-gray-600 mb-1">
        {formatTime(item?.startTime)} - {formatTime(item?.endTime)}
        {item?.type === 'booking' ? ` • ${item?.ownerName || ''}` : ` • ${item?.organizer || ''}`}
      </div>

      {item?.type === 'booking' && item?.status === 'completed' && (
        <div className="mt-auto inline-block bg-white/60 text-gray-600 px-1.5 py-0.5 rounded text-[10px] w-max">
          Завершено
        </div>
      )}

      {item?.type === 'event' && (
        <div className="mt-auto inline-block bg-white/60 text-gray-600 px-1.5 py-0.5 rounded text-[10px] w-max">
          Мероприятие
        </div>
      )}
    </div>
  );
};