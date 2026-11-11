import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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

const TAB_ROUTES: Record<NavTab, string> = {
  home: '/',
  schedule: '/schedule',
  events: '/events',
  bookings: '/bookings',
}

function getActiveTab(pathname: string): NavTab {
  if (pathname.startsWith('/schedule')) return 'schedule'
  if (pathname.startsWith('/events')) return 'events'
  if (pathname.startsWith('/bookings')) return 'bookings'
  return 'home'
}

export function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [role, setRole] = useState<'student' | 'admin'>('student')

  useEffect(() => {
    getMe()
      .then((me) => {
        if (!me) return
        setRole(mapApiUserToUser(me).role ?? 'student')
      })
      .catch(() => undefined)
  }, [])

  const handleTabChange = (tab: NavTab) => {
    navigate(TAB_ROUTES[tab])
  }

  const handleCloseOverlay = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const isOverlayRoute = location.pathname === '/profile' || location.pathname === '/bookings/new'
  const activeTab = getActiveTab(location.pathname)

  return (
    <div className="min-h-screen bg-brand-bg">
      <Routes>
        <Route
          path="/"
          element={<HomePage onTabChange={handleTabChange} onProfileOpen={() => navigate('/profile')} />}
        />
        <Route
          path="/schedule"
          element={<SchedulePage onCreateBooking={() => navigate('/bookings/new')} />}
        />
        <Route path="/events" element={<EventsPage role={role} />} />
        <Route
          path="/bookings"
          element={<BookingsPage role={role} onCreateBooking={() => navigate('/bookings/new')} />}
        />
        <Route path="/bookings/new" element={<NewBookingPage onClose={handleCloseOverlay} />} />
        <Route path="/profile" element={<ProfilePage onClose={handleCloseOverlay} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isOverlayRoute && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  )
}
