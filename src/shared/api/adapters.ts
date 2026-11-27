import { formatDateLabel, formatShortDateTime, formatTime } from '@/shared/lib'
import { formatCreatedAt } from '@/shared/lib/format'
import type { Booking } from '@/entities/booking'
import type { BookingRequest, RequestTab } from '@/entities/booking-request'
import type { MyBooking, MyBookingTab } from '@/entities/my-booking'
import type { StudentProfile } from '@/entities/profile'
import type { Booking as ScheduleBooking, ScheduleSpace } from '@/entities/schedule'
import type { Space, SpaceEquipment } from '@/entities/space'
import type { User } from '@/entities/user'
import type { components } from './schema'
type ApiUser = components['schemas']['entities.User']
type ApiBooking = components['schemas']['api.Booking']
function equipment(amenity: components['schemas']['entities.Amenity']): SpaceEquipment {
  const icon = amenity.icon?.toLowerCase() ?? ''
  return { icon: icon.includes('wifi') ? 'wifi' : icon.includes('board') ? 'whiteboard' : icon.includes('projector') ? 'projector' : 'table', label: amenity.name ?? 'Оборудование' }
}
export function mapApiUserToUser(user?: ApiUser): User {
  return { id: user?.user_id ?? 0, firstName: user?.first_name ?? '', lastName: user?.last_name ?? '', status: user?.occupation ?? '', role: user?.role ?? 'student', notificationsAllowed: user?.notifications_allowed ?? false }
}
export function mapApiUserToStudentProfile(user?: ApiUser): StudentProfile {
  return { firstName: user?.first_name ?? '', lastName: user?.last_name ?? '', middleName: user?.patronymic ?? '', status: user?.occupation ?? '', vkDisplayName: user?.first_name ?? '' }
}
export function mapApiHomeToTodayBookings(home?: components['schemas']['api.Home']): Booking[] {
  return home?.today?.items?.map(item => ({ id: item.booking_id!, startTime: item.starts_at ?? '', endTime: item.ends_at ?? '', spaceName: item.space?.name ?? '', spaceId: item.space?.space_id, status: item.status, title: item.title ?? item.purpose, type: 'booking' })) ?? []
}
export function mapApiSpaceToSpace(space: components['schemas']['api.Space']): Space {
  const status = space.now?.state ?? 'closed'
  const until = space.now?.until ? ' до ' + formatTime(space.now.until) : ''
  return { id: space.space_id!, name: space.name ?? 'Помещение', capacity: space.capacity ?? 0, status,
    statusLabel: (status === 'free' ? 'Свободно' : status === 'busy' ? 'Занято' : 'Закрыто') + until,
    photoUrl: space.photo_url ?? undefined, equipment: space.amenities?.map(equipment) ?? [] }
}
export function mapApiHomeToSpaces(home?: components['schemas']['api.Home']): Space[] { return home?.spaces?.map(mapApiSpaceToSpace) ?? [] }
export function mapApiScheduleToView(schedule?: components['schemas']['api.Schedule']): { spaces: ScheduleSpace[]; items: ScheduleBooking[] } {
  const spaces = schedule?.spaces?.map(space => ({ id: space.space_id!, name: space.name ?? 'Зал', capacity: space.capacity ?? 0, color: space.color || '#6867e9' })) ?? []
  return { spaces, items: schedule?.items?.map(item => ({ id: item.booking_id!, startTime: item.starts_at ?? '', endTime: item.ends_at ?? '', spaceId: item.space_id!, spaceName: spaces.find(s => s.id === item.space_id)?.name ?? '', title: item.title ?? '', status: item.status, ownerName: item.owner_name, type: 'booking', isMine: item.is_mine })) ?? [] }
}
export function mapApiBookingsToMyBookings(items: ApiBooking[] | undefined, tab: MyBookingTab): MyBooking[] {
  return items?.map(item => ({ id: String(item.booking_id), bookingId: item.booking_id, tab, status: item.status ?? 'pending',
    createdAtLabel: formatCreatedAt(item.created_at), dateTimeLabel: formatShortDateTime(item.starts_at, item.ends_at),
    spaceAndPeople: (item.space?.name ?? 'Помещение') + ' · ' + (item.people_count ?? 0) + ' чел.',
    title: item.title, purpose: item.purpose ?? '', peopleCount: item.people_count, rejectReason: item.reject_reason?.text,
    startsAt: item.starts_at, endsAt: item.ends_at, spaceId: item.space?.space_id, actions: item.actions ?? [], cancelledBy: item.cancelled_by })) ?? []
}
export function mapApiAdminStatusToTab(status?: components['schemas']['entities.BookingStatus']): RequestTab {
  return ['approved', 'completed', 'cancelled'].includes(status ?? '') ? 'approved' : ['rejected', 'withdrawn'].includes(status ?? '') ? 'rejected' : 'new'
}
export function mapApiAdminBookingToRequest(booking?: components['schemas']['api.AdminBooking'], spaces: components['schemas']['api.Space'][] = []): BookingRequest {
  const capacity = spaces.find(space => space.space_id === booking?.space?.space_id)?.capacity
  const decision = booking?.decision
  return { id: String(booking?.booking_id), bookingId: booking?.booking_id, status: mapApiAdminStatusToTab(booking?.status), bookingStatus: booking?.status ?? 'pending',
    applicantInitials: ((booking?.first_name?.[0] ?? '') + (booking?.last_name?.[0] ?? '')).toUpperCase(),
    vkUserId: booking?.user?.vk_user_id, createdAtLabel: formatCreatedAt(booking?.created_at), spaceName: booking?.space?.name ?? '',
    capacityLabel: capacity ? 'до ' + capacity + ' чел.' : '', lastName: booking?.last_name ?? '', firstName: booking?.first_name ?? '',
    dateLabel: formatDateLabel(booking?.starts_at), fromTime: formatTime(booking?.starts_at), toTime: formatTime(booking?.ends_at),
    purpose: booking?.purpose ?? '', peopleCount: booking?.people_count ?? 0, peopleLimit: capacity,
    warningText: booking?.conflicts?.map(item => 'Пересекается с заявкой ' + (item.owner_name || '№' + item.booking_id) + ' (' + formatTime(item.starts_at) + '–' + formatTime(item.ends_at) + ')').join('\n') || undefined,
    decisionReason: booking?.reject_reason?.text, decisionReasonTitle: booking?.reject_reason?.title,
    decisionMeta: decision?.at ? (decision.by?.first_name || 'Администратор') + ' · ' + formatDateLabel(decision.at) + ', ' + formatTime(decision.at) : undefined }
}
