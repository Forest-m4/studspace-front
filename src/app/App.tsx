import { useState } from 'react'
import { HomePage, SchedulePage } from '@/pages'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  return (
    <div className="min-h-screen bg-brand-bg">
      {activeTab === 'home' && <HomePage onTabChange={setActiveTab} />}
      {activeTab === 'schedule' && <SchedulePage />}
      {(activeTab === 'events' || activeTab === 'bookings') && (
        <div className="flex items-center justify-center min-h-screen pb-20">
          <p className="text-brand-muted text-lg font-medium">
            Страница в разработке
          </p>
        </div>
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
