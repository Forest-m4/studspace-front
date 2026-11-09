import { useEffect, useState } from 'react'
import {
  BookingsPage,
  EventsPage,
  HomePage,
  NewBookingPage,
  ProfilePage,
  SchedulePage,
} from '@/pages'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'
import { mapApiUserToUser } from '@/shared/api/adapters'
import { getMe } from '@/shared/api/studspace'

type OverlayScreen = 'none' | 'profile' | 'new-booking'

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [overlayScreen, setOverlayScreen] = useState<OverlayScreen>('none')
  const [role, setRole] = useState<'student' | 'admin'>('student')

  useEffect(() => {
    getMe()
      .then((me) => {
        if (!me) return
        setRole(mapApiUserToUser(me).role ?? 'student')
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="min-h-screen bg-brand-bg">
      {overlayScreen === 'profile' ? (
        <ProfilePage onClose={() => setOverlayScreen('none')} />
      ) : overlayScreen === 'new-booking' ? (
        <NewBookingPage onClose={() => setOverlayScreen('none')} />
      ) : (
        <>
          {activeTab === 'home' && (
            <HomePage onTabChange={setActiveTab} onProfileOpen={() => setOverlayScreen('profile')} />
          )}
          {activeTab === 'schedule' && <SchedulePage onCreateBooking={() => setOverlayScreen('new-booking')} />}
          {activeTab === 'events' && <EventsPage role={role} />}
          {activeTab === 'bookings' && (
            <BookingsPage role={role} onCreateBooking={() => setOverlayScreen('new-booking')} />
          )}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  )
}
