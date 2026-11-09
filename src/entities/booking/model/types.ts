export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Booking {
  id: string | number;
  startTime: string;
  endTime: string;
  spaceName?: string;
  spaceId?: number;
  status?: BookingStatus;
  title?: string;
  date?: string;
  type: 'booking' | 'event'; // <--- Обязательно
  isMine?: boolean;
  ownerName?: string;
  organizer?: string;
}