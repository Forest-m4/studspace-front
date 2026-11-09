import { AppHeader } from '@/widgets/app-header'
import { TodayBookingsSection } from '@/widgets/today-bookings'
import { SpacesListSection } from '@/widgets/spaces-list'
import { MOCK_TODAY_BOOKINGS } from '@/entities/booking'
import { MOCK_SPACES } from '@/entities/space'
import { MOCK_USER } from '@/entities/user'
import type { NavTab } from '@/widgets/bottom-nav'

export interface HomePageProps {
  onTabChange: (tab: NavTab) => void
  onProfileOpen?: () => void
}

export function HomePage({ onTabChange, onProfileOpen }: HomePageProps) {
  return (
    <main className="flex flex-col gap-4 max-w-160 w-full px-4 pt-6 pb-32 mx-auto">
      <AppHeader
        user={MOCK_USER}
        hasNotifications
        onProfileClick={onProfileOpen}
      />
      <TodayBookingsSection
        bookings={MOCK_TODAY_BOOKINGS}
        onViewAll={() => onTabChange('schedule')}
      />
      <SpacesListSection
        spaces={MOCK_SPACES}
        onBook={() => onTabChange('bookings')}
      />
    </main>
  )
}
