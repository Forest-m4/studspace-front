import { Bell } from 'lucide-react'
import { Avatar } from '@/shared/ui'
import type { User } from '@/entities/user'

export interface AppHeaderProps {
  user: User
  hasNotifications?: boolean
  onNotificationsClick?: () => void
}

export function AppHeader({ user, hasNotifications = false, onNotificationsClick }: AppHeaderProps) {
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <div className="bg-white rounded-2xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar name={fullName} size="md" />
        <span className="text-[24px] font-bold text-[#1f1a3d] leading-8">
          Привет, {user.firstName}!
        </span>
      </div>
      <button
        onClick={onNotificationsClick}
        className="relative size-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Уведомления"
      >
        <Bell size={20} className="text-[#1f1a3d]" strokeWidth={1.8} />
        {hasNotifications && (
          <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[#6867e9] ring-2 ring-white" />
        )}
      </button>
    </div>
  )
}
