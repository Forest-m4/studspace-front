import { useState } from 'react'
import { BookingsPage, EventsPage, HomePage, SchedulePage } from '@/pages'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  return (
    <div className="min-h-screen bg-brand-bg">
      {activeTab === 'home' && <HomePage onTabChange={setActiveTab} />}
      {activeTab === 'schedule' && <SchedulePage />}
      {activeTab === 'events' && <EventsPage />}
      {activeTab === 'bookings' && <BookingsPage />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
