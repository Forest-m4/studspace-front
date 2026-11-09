import type { components } from './schema'
import type { Booking } from '@/entities/booking'
import type { EventListItem, EventWeekDay, FeaturedEvent } from '@/entities/event'
import type { BookingRequest, RequestTab } from '@/entities/booking-request'
import type { MyBooking, MyBookingTab } from '@/entities/my-booking'
import type { StudentProfile } from '@/entities/profile'
import type { Booking as ScheduleBooking, ScheduleSpace } from '@/entities/schedule'
import type { Space, SpaceEquipment } from '@/entities/space'
import type { User } from '@/entities/user'

type ApiHome = components['schemas']['api.Home']
type ApiBooking = components['schemas']['api.Booking']
type ApiEventList = components['schemas']['api.EventList']
type ApiSchedule = components['schemas']['api.Schedule']
type ApiSpace = components['schemas']['api.Space']
type ApiUser = components['schemas']['entities.User']

function formatTime(value?: string) {
  if (!value) return '--:--'
  return new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(value?: string) {
  if (!value) return ''
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(value))

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function formatShortDateTime(start?: string, end?: string) {
  if (!start || !end) return '--:--'
  const day = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(start))
  return `${day} · ${formatTime(start)}-${formatTime(end)}`
}

function mapAmenityToEquipment(amenity?: components['schemas']['entities.Amenity']): SpaceEquipment {
  const icon = amenity?.icon?.toLowerCase() ?? ''
  const name = amenity?.name ?? 'Оборудование'

  if (icon.includes('wifi')) return { icon: 'wifi', label: name }
  if (icon.includes('board')) return { icon: 'whiteboard', label: name }
  if (icon.includes('projector')) return { icon: 'projector', label: name }

  return { icon: 'table', label: name }
}

export function mapApiUserToUser(user?: ApiUser): User {
  return {
    id: user?.user_id ?? 0,
    firstName: user?.first_name ?? 'Пользователь',
    lastName: user?.last_name ?? '',
    status: user?.occupation ?? '',
    role: user?.role ?? 'student',
    notificationsAllowed: user?.notifications_allowed ?? false,
  }
}

export function mapApiUserToStudentProfile(user?: ApiUser): StudentProfile {
  return {
    firstName: user?.first_name ?? '',
    lastName: user?.last_name ?? '',
    middleName: user?.patronymic ?? '',
    status: user?.occupation ?? 'Студент',
    vkDisplayName: user?.first_name ?? '',
  }
}

export function mapApiHomeToTodayBookings(home?: ApiHome): Booking[] {
  return (
    home?.today?.items?.map((item) => ({
      id: item.booking_id ?? item.event_id ?? Math.random(),
      startTime: item.starts_at ?? '',
      endTime: item.ends_at ?? '',
      spaceName: item.space?.name ?? '',
      spaceId: item.space?.space_id,
      status: (item.status as Booking['status']) ?? 'pending',
      title: item.title ?? item.purpose ?? 'Без названия',
      type: item.type === 'event' ? 'event' : 'booking',
    })) ?? []
  )
}

export function mapApiSpaceToSpace(space: ApiSpace): Space {
  const state = space.now?.state
  const status = state === 'free' ? 'free' : 'busy'

  return {
    id: space.space_id ?? 0,
    name: space.name ?? 'Помещение',
    capacity: space.capacity ?? 0,
    status,
    statusLabel: state === 'busy' ? 'Занято' : state === 'closed' ? 'Закрыто' : 'Свободно',
    equipment: space.amenities?.map(mapAmenityToEquipment) ?? [],
  }
}

export function mapApiHomeToSpaces(home?: ApiHome): Space[] {
  return home?.spaces?.map(mapApiSpaceToSpace) ?? []
}

export function mapApiScheduleToView(schedule?: ApiSchedule): { spaces: ScheduleSpace[]; items: ScheduleBooking[] } {
  const spaces: ScheduleSpace[] =
    schedule?.spaces?.map((space) => ({
      id: space.space_id ?? 0,
      name: space.name ?? 'Зал',
      capacity: space.capacity ?? 0,
      color: space.color ?? '#6867e9',
    })) ?? []

  const spaceNameById = new Map(spaces.map((space) => [space.id, space.name]))

  const items: ScheduleBooking[] =
    schedule?.items?.map((item) => ({
      id: item.booking_id ?? item.event_id ?? Math.random(),
      startTime: item.starts_at ?? '',
      endTime: item.ends_at ?? '',
      spaceId: item.space_id ?? 0,
      spaceName: spaceNameById.get(item.space_id ?? 0) ?? 'Зал',
      title: item.title ?? 'Без названия',
      status: (item.status as ScheduleBooking['status']) ?? 'pending',
      ownerName: item.owner_name,
      organizer: item.organizer,
      type: item.type === 'event' ? 'event' : 'booking',
      isMine: item.is_mine,
    })) ?? []

  return { spaces, items }
}

export function mapApiEventsToEventsView(
  eventList?: ApiEventList,
  selectedDateISO?: string,
): { count: number; featured: FeaturedEvent; list: EventListItem[]; weekDays: EventWeekDay[] } {
  const featuredSource = eventList?.featured ?? eventList?.items?.[0]
  const featured: FeaturedEvent = {
    badge: 'Сегодня',
    startTime: formatTime(featuredSource?.starts_at),
    endTime: formatTime(featuredSource?.ends_at),
    title: featuredSource?.title ?? 'Нет мероприятий',
  }

  const list: EventListItem[] =
    eventList?.items?.map((event) => {
      const date = event.starts_at ? new Date(event.starts_at) : null
      const day = date ? String(date.getDate()) : '--'
      const month = date
        ? new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date).replace('.', '')
        : '--'

      return {
        id: String(event.event_id ?? Math.random()),
        eventId: event.event_id,
        dateLabel: formatDateLabel(event.starts_at),
        day,
        month,
        title: event.title ?? 'Мероприятие',
        time: `${formatTime(event.starts_at)}-${formatTime(event.ends_at)}`,
        state: event.state,
        isRegistered: event.is_registered,
        isSubscribed: event.is_subscribed,
      }
    }) ?? []

  const base = selectedDateISO ? new Date(`${selectedDateISO}T00:00:00`) : new Date()
  const dayOffset = (base.getDay() + 6) % 7
  const monday = new Date(base)
  monday.setDate(base.getDate() - dayOffset)
  const weekDays: EventWeekDay[] = Array.from({ length: 7 }, (_, index) => {
    const dayDate = new Date(monday)
    dayDate.setDate(monday.getDate() + index)
    return {
      short: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(dayDate).replace('.', ''),
      day: dayDate.getDate(),
      active: dayDate.toDateString() === base.toDateString(),
    }
  })

  return {
    count: eventList?.week_total ?? list.length,
    featured,
    list,
    weekDays,
  }
}

export function mapApiBookingsToMyBookings(
  items: ApiBooking[] | undefined,
  tab: MyBookingTab,
): MyBooking[] {
  return (
    items?.map((item) => {
      const status = item.status === 'withdrawn' ? 'cancelled' : item.status
      const dateTimeLabel =
        tab === 'active'
          ? `${formatTime(item.starts_at)}-${formatTime(item.ends_at)}\n${formatDateLabel(item.starts_at)}`
          : formatShortDateTime(item.starts_at, item.ends_at)

      return {
        id: String(item.booking_id ?? Math.random()),
        bookingId: item.booking_id,
        tab,
        status: (status as MyBooking['status']) ?? 'pending',
        createdAtLabel: item.created_at ? formatDateLabel(item.created_at) : '',
        dateTimeLabel,
        spaceAndPeople: `${item.space?.name ?? 'Помещение'} · ${item.people_count ?? 0} человек`,
        purpose: item.purpose ?? 'Без описания',
        rejectReason: item.reject_reason?.text,
        startsAt: item.starts_at,
        endsAt: item.ends_at,
        spaceId: item.space?.space_id,
      }
    }) ?? []
  )
}

export function mapApiAdminStatusToTab(status?: components['schemas']['entities.BookingStatus']): RequestTab {
  if (status === 'approved' || status === 'completed' || status === 'cancelled') return 'approved'
  if (status === 'rejected' || status === 'withdrawn') return 'rejected'
  return 'new'
}

export function mapApiAdminBookingToRequest(
  booking?: components['schemas']['api.AdminBooking'],
): BookingRequest {
  const tab = mapApiAdminStatusToTab(booking?.status)

  return {
    id: String(booking?.booking_id ?? Math.random()),
    bookingId: booking?.booking_id,
    status: tab,
    applicantInitials: `${booking?.first_name?.[0] ?? ''}${booking?.last_name?.[0] ?? ''}` || '??',
    createdAtLabel: formatDateLabel(booking?.created_at),
    spaceName: booking?.space?.name ?? 'Помещение',
    capacityLabel: 'до ? чел.',
    lastName: booking?.last_name ?? '',
    firstName: booking?.first_name ?? '',
    dateLabel: formatDateLabel(booking?.starts_at),
    fromTime: formatTime(booking?.starts_at),
    toTime: formatTime(booking?.ends_at),
    purpose: booking?.purpose ?? '',
    peopleCount: booking?.people_count ?? 0,
    peopleLimit: booking?.people_count ?? 0,
    decisionReason: booking?.reject_reason?.text,
    decisionMeta: booking?.decision?.at ? `Решение: ${formatDateLabel(booking.decision.at)}` : undefined,
  }
}
