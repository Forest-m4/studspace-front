import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BookingsPage } from '@/pages/bookings'
import { EventsPage } from '@/pages/events'
import { HomePage } from '@/pages/home'
import { NewBookingPage } from '@/pages/new-booking'
import { ProfilePage } from '@/pages/profile'
import { SchedulePage } from '@/pages/schedule'
import { routes } from '@/shared/config'
import { MainLayout } from '../layouts/MainLayout'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: routes.home, element: <HomePage /> },
      { path: routes.schedule, element: <SchedulePage /> },
      { path: routes.events, element: <EventsPage /> },
      { path: routes.bookings, element: <BookingsPage /> },
    ],
  },
  { path: routes.newBooking, element: <NewBookingPage /> },
  { path: routes.profile, element: <ProfilePage /> },
  { path: '*', element: <Navigate to={routes.home} replace /> },
])
