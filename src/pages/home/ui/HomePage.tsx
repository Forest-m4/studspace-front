import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_TODAY_BOOKINGS } from '@/entities/booking'
import type { Booking } from '@/entities/booking'
import { MOCK_SPACES, spaceApi } from '@/entities/space'
import type { Space } from '@/entities/space'
import { MOCK_USER, userApi } from '@/entities/user'
import type { User } from '@/entities/user'
import { mapApiHomeToSpaces, mapApiHomeToTodayBookings, mapApiUserToUser } from '@/shared/api/adapters'
import { routes } from '@/shared/config'
import { AppHeader } from '@/widgets/app-header'
import type { NavTab } from '@/widgets/bottom-nav'
import { SpacesListSection } from '@/widgets/spaces-list'
import { TodayBookingsSection } from '@/widgets/today-bookings'

const TAB_ROUTES: Record<NavTab, string> = {
  home: routes.home,
  schedule: routes.schedule,
  events: routes.events,
  bookings: routes.bookings,
}

export interface HomePageProps {
  onTabChange?: (tab: NavTab) => void
  onProfileOpen?: () => void
}

export function HomePage({ onTabChange, onProfileOpen }: HomePageProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User>(MOCK_USER)
  const [bookings, setBookings] = useState<Booking[]>(MOCK_TODAY_BOOKINGS)
  const [spaces, setSpaces] = useState<Space[]>(MOCK_SPACES)

  useEffect(() => {
    Promise.all([spaceApi.getHome(), userApi.getMe()])
      .then(([home, me]) => {
        if (home) {
          setBookings(mapApiHomeToTodayBookings(home))
          setSpaces(mapApiHomeToSpaces(home))
        }
        if (me) {
          setUser(mapApiUserToUser(me))
        }
      })
      .catch(() => undefined)
  }, [])

  const handleNavigateTab = (tab: NavTab) => {
    if (onTabChange) {
      onTabChange(tab)
      return
    }
    navigate(TAB_ROUTES[tab])
  }

  const handleProfileOpen = () => {
    if (onProfileOpen) {
      onProfileOpen()
      return
    }
    navigate(routes.profile)
  }

  return (
    <main className="flex flex-col gap-4 max-w-160 w-full px-4 pt-6 pb-32 mx-auto">
      <AppHeader
        user={user}
        hasNotifications={Boolean(user.notificationsAllowed)}
        onNotificationsClick={() => {
          userApi
            .patchNotifications(!user.notificationsAllowed)
            .then(() => setUser((prev) => ({ ...prev, notificationsAllowed: !prev.notificationsAllowed })))
            .catch(() => undefined)
        }}
        onProfileClick={handleProfileOpen}
      />
      <TodayBookingsSection
        bookings={bookings}
        onViewAll={() => handleNavigateTab('schedule')}
      />
      <SpacesListSection
        spaces={spaces}
        onBook={() => handleNavigateTab('bookings')}
      />
    </main>
  )
}
