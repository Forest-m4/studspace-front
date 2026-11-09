import { useState } from 'react'
import { BookingsPage, EventsPage, HomePage, ProfilePage, SchedulePage } from '@/pages'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-brand-bg">
      {isProfileOpen ? (
        <ProfilePage onClose={() => setIsProfileOpen(false)} />
      ) : (
        <>
          {activeTab === 'home' && (
            <HomePage onTabChange={setActiveTab} onProfileOpen={() => setIsProfileOpen(true)} />
          )}
          {activeTab === 'schedule' && <SchedulePage />}
          {activeTab === 'events' && <EventsPage />}
          {activeTab === 'bookings' && <BookingsPage />}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  )
}
