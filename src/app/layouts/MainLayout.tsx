import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/user/model/session-context'
import { routes } from '@/shared/config'
import { BottomNav } from '@/widgets/bottom-nav'
import type { NavTab } from '@/widgets/bottom-nav'
const TAB_ROUTES: Record<NavTab, string> = { home: routes.home, schedule: routes.schedule, events: routes.events, bookings: routes.bookings }
export function MainLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useSession()
  const role = user.role ?? 'student'
  const activeTab = (Object.entries(TAB_ROUTES).find(([tab, route]) => tab !== 'home' && pathname.startsWith(route))?.[0] ?? 'home') as NavTab
  return <div className="min-h-screen bg-brand-bg"><Outlet context={{ role }} /><BottomNav activeTab={activeTab} role={role} onTabChange={tab => navigate(TAB_ROUTES[tab])} /></div>
}
