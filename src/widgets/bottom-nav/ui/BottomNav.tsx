import { Home, Calendar, Sparkles, ClipboardList } from 'lucide-react'

export type NavTab = 'home' | 'schedule' | 'events' | 'bookings'

export interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

const navItems: { tab: NavTab; label: string; Icon: typeof Home }[] = [
  { tab: 'home', label: 'Главная', Icon: Home },
  { tab: 'schedule', label: 'Расписание', Icon: Calendar },
  { tab: 'events', label: 'Мероприятия', Icon: Sparkles },
  { tab: 'bookings', label: 'Мои заявки', Icon: ClipboardList },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#ececf0] flex items-stretch pb-safe z-50">
      {navItems.map(({ tab, label, Icon }) => {
        const isActive = activeTab === tab

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer transition-colors"
            aria-label={label}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2 : 1.6}
              className={isActive ? 'text-brand-primary' : 'text-brand-dark'}
            />
            <span
              className={`text-[12px] leading-3.75 ${
                isActive
                  ? 'text-brand-primary font-medium'
                  : 'text-brand-dark font-normal'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
