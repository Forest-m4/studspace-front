import { useEffect, useState } from 'react'
import { AppHeader } from '@/widgets/app-header'
import { TodayBookingsSection } from '@/widgets/today-bookings'
import { SpacesListSection } from '@/widgets/spaces-list'
import { MOCK_TODAY_BOOKINGS } from '@/entities/booking'
import type { Booking } from '@/entities/booking'
import { MOCK_SPACES } from '@/entities/space'
import type { Space } from '@/entities/space'
import { MOCK_USER } from '@/entities/user'
import type { User } from '@/entities/user'
import type { NavTab } from '@/widgets/bottom-nav'
import { mapApiHomeToSpaces, mapApiHomeToTodayBookings, mapApiUserToUser } from '@/shared/api/adapters'
import { getHome, getMe, patchNotifications } from '@/shared/api/studspace'

export interface HomePageProps {
  onTabChange: (tab: NavTab) => void
  onProfileOpen?: () => void
}

export function HomePage({ onTabChange, onProfileOpen }: HomePageProps) {
  const [user, setUser] = useState<User>(MOCK_USER)
  const [bookings, setBookings] = useState<Booking[]>(MOCK_TODAY_BOOKINGS)
  const [spaces, setSpaces] = useState<Space[]>(MOCK_SPACES)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [home, me] = await Promise.all([getHome(), getMe()])
      if (!active) return

      if (home) {
        setBookings(mapApiHomeToTodayBookings(home))
        setSpaces(mapApiHomeToSpaces(home))
      }

      if (me) {
        setUser(mapApiUserToUser(me))
      }
    }

    load().catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="flex flex-col gap-4 max-w-160 w-full px-4 pt-6 pb-32 mx-auto">
      <AppHeader
        user={user}
        hasNotifications={Boolean(user.notificationsAllowed)}
        onNotificationsClick={() => {
          patchNotifications(!user.notificationsAllowed)
            .then(() => setUser((prev) => ({ ...prev, notificationsAllowed: !prev.notificationsAllowed })))
            .catch(() => undefined)
        }}
        onProfileClick={onProfileOpen}
      />
      <TodayBookingsSection
        bookings={bookings}
        onViewAll={() => onTabChange('schedule')}
      />
      <SpacesListSection
        spaces={spaces}
        onBook={() => onTabChange('bookings')}
      />
    </main>
  )
}
