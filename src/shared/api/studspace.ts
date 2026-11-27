import { api } from './client'
import { ApiRequestError } from './errors'
import type { components } from './schema'
export type AdminTab = 'new' | 'approved' | 'rejected'
function required<T>(data: T | undefined): T {
  if (data === undefined) throw new ApiRequestError(502, 'Сервер вернул пустой ответ. Попробуйте ещё раз.')
  return data
}
export async function getHome() { const { data } = await api.GET('/home'); return required(data) }
export async function authSync(body: components['schemas']['api.SyncUserRequest']) {
  const { data } = await api.POST('/auth/sync', { body }); return required(data)
}
export async function getMe() { const { data } = await api.GET('/me'); return required(data) }
export async function patchMe(body: components['schemas']['api.PatchMeRequest']) {
  const { data } = await api.PATCH('/me', { body }); return required(data)
}
export async function patchNotifications(allowed: boolean) { await api.PATCH('/me/notifications', { body: { allowed } }) }
export async function getSchedule(from: string, to: string) {
  const { data } = await api.GET('/schedule', { params: { query: { from, to } } }); return required(data)
}
export async function getBookingFeed(from: string, to: string) {
  const { data } = await api.GET('/bookings', { params: { query: { from, to } } }); return required(data)
}
export async function getMyBookings(tab: 'active' | 'history', cursor?: string) {
  const { data } = await api.GET('/bookings/my', { params: { query: { tab, limit: 20, cursor } } }); return required(data)
}
export async function getAdminBookings(tab: AdminTab, cursor?: string) {
  const { data } = await api.GET('/admin/bookings', { params: { query: { tab, limit: 20, cursor } } }); return required(data)
}
export async function createBooking(body: components['schemas']['api.CreateBookingRequest']) {
  const { data } = await api.POST('/bookings', { body }); return required(data)
}
export async function withdrawBooking(id: number) {
  const { data } = await api.POST('/bookings/{id}/withdraw', { params: { path: { id } } }); return required(data)
}
export async function rescheduleBooking(id: number, body: components['schemas']['api.RescheduleBookingRequest']) {
  const { data } = await api.POST('/bookings/{id}/reschedule', { params: { path: { id } }, body }); return required(data)
}
export async function cancelBooking(id: number) {
  const { data } = await api.POST('/bookings/{id}/cancel', { params: { path: { id } } }); return required(data)
}
export async function approveAdminBooking(id: number) {
  const { data } = await api.POST('/admin/bookings/{id}/approve', { params: { path: { id } } }); return required(data)
}
export async function rejectAdminBooking(id: number, reasonText: string, reasonTitle = 'Причина отказа') {
  const { data } = await api.POST('/admin/bookings/{id}/reject', {
    params: { path: { id } }, body: { reason_text: reasonText, reason_title: reasonTitle },
  }); return required(data)
}
export async function cancelAdminBooking(id: number) {
  const { data } = await api.POST('/admin/bookings/{id}/cancel', { params: { path: { id } } }); return required(data)
}
export async function returnAdminBookingToReview(id: number) {
  const { data } = await api.POST('/admin/bookings/{id}/return-to-review', { params: { path: { id } } }); return required(data)
}
export async function getBusyDays(month: string) {
  const { data } = await api.GET('/calendar/busy-days', { params: { query: { month } } }); return required(data)
}
export async function getSpaces() { const { data } = await api.GET('/spaces'); return required(data) }
export async function getSpaceAvailability(id: number, date: string) {
  const { data } = await api.GET('/spaces/{id}/availability', { params: { path: { id }, query: { date } } }); return required(data)
}
