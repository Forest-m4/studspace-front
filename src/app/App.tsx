import { useState } from 'react'
import { HomePage } from '@/pages/home'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  return (
    <div className="min-h-screen bg-[#efeff1]">
      {activeTab === 'home' && <HomePage onTabChange={setActiveTab} />}
      {activeTab !== 'home' && (
        <div className="flex items-center justify-center min-h-screen pb-20">
          <p className="text-[#7e78a8] text-lg font-medium">
            Страница в разработке
          </p>
        </div>
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
