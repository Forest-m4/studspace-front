import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { userApi } from '@/entities/user'
import { mapApiUserToUser } from '@/shared/api/adapters'
import { routes } from '@/shared/config'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'

const TAB_ROUTES: Record<NavTab, string> = {
  home: routes.home,
  schedule: routes.schedule,
  events: routes.events,
  bookings: routes.bookings,
}

function getActiveTab(pathname: string): NavTab {
  if (pathname.startsWith(routes.schedule)) return 'schedule'
  if (pathname.startsWith(routes.events)) return 'events'
  if (pathname.startsWith(routes.bookings)) return 'bookings'
  return 'home'
}

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [role, setRole] = useState<'student' | 'admin'>('student')

  useEffect(() => {
    userApi
      .getMe()
      .then((me) => {
        if (!me) return
        setRole(mapApiUserToUser(me).role ?? 'student')
      })
      .catch(() => undefined)
  }, [])

  const activeTab = getActiveTab(location.pathname)

  return (
    <div className="min-h-screen bg-brand-bg">
      <Outlet context={{ role }} />
      <BottomNav activeTab={activeTab} onTabChange={(tab) => navigate(TAB_ROUTES[tab])} />
    </div>
  )
}
