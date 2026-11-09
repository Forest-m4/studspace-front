import { api } from './client'
import type { components } from './schema'

export type AdminTab = 'new' | 'approved' | 'rejected'

export async function getHome() {
  const { data } = await api.GET('/home')
  return data
}

export async function authSync(body: components['schemas']['api.SyncUserRequest']) {
  const { data } = await api.POST('/auth/sync', { body })
  return data
}

export async function getMe() {
  const { data } = await api.GET('/me')
  return data
}

export async function patchMe(body: components['schemas']['api.PatchMeRequest']) {
  const { data } = await api.PATCH('/me', { body })
  return data
}

export async function patchNotifications(allowed: boolean) {
  await api.PATCH('/me/notifications', { body: { allowed } })
}

export async function getSchedule(from: string, to: string) {
  const { data } = await api.GET('/schedule', { params: { query: { from, to } } })
  return data
}

export async function getEvents(from: string, to: string) {
  const { data } = await api.GET('/events', { params: { query: { from, to } } })
  return data
}

export async function getMyBookings(tab: 'active' | 'history') {
  const { data } = await api.GET('/bookings/my', { params: { query: { tab, limit: 100 } } })
  return data
}

export async function getAdminBookings(tab: AdminTab) {
  const { data } = await api.GET('/admin/bookings', { params: { query: { tab, limit: 100 } } })
  return data
}

export async function createBooking(body: components['schemas']['api.CreateBookingRequest']) {
  const { data } = await api.POST('/bookings', { body })
  return data
}

export async function withdrawBooking(id: number) {
  const { data } = await api.POST('/bookings/{id}/withdraw', { params: { path: { id } } })
  return data
}

export async function rescheduleBooking(id: number, body: components['schemas']['api.RescheduleBookingRequest']) {
  const { data } = await api.POST('/bookings/{id}/reschedule', { params: { path: { id } }, body })
  return data
}

export async function cancelBooking(id: number) {
  const { data } = await api.POST('/bookings/{id}/cancel', { params: { path: { id } } })
  return data
}

export async function approveAdminBooking(id: number) {
  const { data } = await api.POST('/admin/bookings/{id}/approve', { params: { path: { id } } })
  return data
}

export async function rejectAdminBooking(id: number, reasonText: string) {
  const { data } = await api.POST('/admin/bookings/{id}/reject', {
    params: { path: { id } },
    body: { reason_text: reasonText, reason_title: 'Причина отказа' },
  })
  return data
}

export async function cancelAdminBooking(id: number) {
  const { data } = await api.POST('/admin/bookings/{id}/cancel', { params: { path: { id } } })
  return data
}

export async function returnAdminBookingToReview(id: number) {
  const { data } = await api.POST('/admin/bookings/{id}/return-to-review', { params: { path: { id } } })
  return data
}

export async function getBusyDays(month: string) {
  const { data } = await api.GET('/calendar/busy-days', { params: { query: { month } } })
  return data
}

export async function getSpaces() {
  const { data } = await api.GET('/spaces')
  return data
}

export async function registerEvent(id: number) {
  const { data } = await api.POST('/events/{id}/registration', { params: { path: { id } } })
  return data
}

export async function unregisterEvent(id: number) {
  const { data } = await api.DELETE('/events/{id}/registration', { params: { path: { id } } })
  return data
}

export async function subscribeWaitlist(id: number) {
  await api.POST('/events/{id}/waitlist', { params: { path: { id } } })
}

export async function unsubscribeWaitlist(id: number) {
  await api.DELETE('/events/{id}/waitlist', { params: { path: { id } } })
}

export async function createAdminEvent(body: components['schemas']['api.CreateEventRequest']) {
  const { data } = await api.POST('/admin/events', { body })
  return data
}

export async function updateAdminEvent(id: number, body: components['schemas']['api.CreateEventRequest']) {
  const { data } = await api.PATCH('/admin/events/{id}', { params: { path: { id } }, body })
  return data
}

export async function cancelAdminEvent(id: number) {
  const { data } = await api.POST('/admin/events/{id}/cancel', { params: { path: { id } } })
  return data
}
