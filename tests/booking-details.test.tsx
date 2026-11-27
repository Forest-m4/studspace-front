import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { EventsPage } from '@/pages/events'
import { SchedulePage } from '@/pages/schedule'
import { eventApi } from '@/entities/event'
import { scheduleApi } from '@/entities/schedule'
import { bookingApi } from '@/entities/booking'
import { BookingDetailsModal } from '@/widgets/booking-details'
import { SessionContext } from '@/entities/user/model/session-context'
import { toISODate } from '@/shared/lib/format'
import * as api from '@/shared/api/studspace'

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open') } })
})
afterEach(() => { cleanup(); vi.restoreAllMocks() })

const date = toISODate(new Date())
const booking = { booking_id: 12, title: 'Встреча клуба', status: 'approved' as const, first_name: 'Мария', last_name: 'Петрова', purpose: 'Подготовка нового проекта', people_count: 12, starts_at: date + 'T15:00:00+03:00', ends_at: date + 'T17:00:00+03:00', space: { space_id: 1, name: 'Зал А' } }

it('opens the selected event entity from the list and the featured event', async () => {
  vi.spyOn(eventApi, 'getEvents').mockResolvedValue({ items: [{ ...booking, booking_id: 11, title: 'Другая встреча', purpose: 'Другая цель' }, booking], featured: booking, week_total: 2 })
  render(<EventsPage />)
  await screen.findByText('2 события на этой неделе')
  const listEntry = screen.queryByRole('button', { name: 'Открыть мероприятие «Встреча клуба»' })
  expect(listEntry).not.toBeNull()
  fireEvent.click(listEntry!)
  let dialog = await screen.findByRole('dialog', { name: 'Встреча клуба' })
  expect(within(dialog).getByText('Подготовка нового проекта')).toBeTruthy()
  expect(within(dialog).getByText('Мария Петрова')).toBeTruthy()
  expect(within(dialog).getByText('12')).toBeTruthy()
  expect(within(dialog).queryByText('Другая цель')).toBeNull()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Закрыть окно' }))
  fireEvent.click(screen.getByRole('button', { name: 'Открыть событие дня «Встреча клуба»' }))
  dialog = await screen.findByRole('dialog', { name: 'Встреча клуба' })
  expect(within(dialog).getByText('Подготовка нового проекта')).toBeTruthy()
})

it('opens a pending schedule booking and loads the matching entity from the next page of my applications', async () => {
  const pending = { ...booking, status: 'pending' as const }
  vi.spyOn(scheduleApi, 'getSchedule').mockResolvedValue({ spaces: [{ space_id: 1, name: 'Зал А', capacity: 25 }], items: [{ booking_id: 12, space_id: 1, title: booking.title, status: 'pending', starts_at: booking.starts_at, ends_at: booking.ends_at, is_mine: true, owner_name: 'Мария Петрова' }] })
  const mine = vi.spyOn(bookingApi, 'getMyBookings').mockResolvedValueOnce({ items: [{ booking_id: 99 }], next_cursor: 'next' }).mockResolvedValueOnce({ items: [pending] })
  render(<MemoryRouter><SessionContext.Provider value={{ user: { user_id: 1, role: 'student' }, setUser: vi.fn() }}><SchedulePage /></SessionContext.Provider></MemoryRouter>)
  await screen.findByRole('group', { name: /Встреча клуба.*На рассмотрении/ })
  const entry = screen.queryByRole('button', { name: /Открыть заявку «Встреча клуба»/ })
  expect(entry).not.toBeNull()
  fireEvent.click(entry!)
  const dialog = await screen.findByRole('dialog', { name: 'Встреча клуба' })
  expect(await within(dialog).findByText('Подготовка нового проекта')).toBeTruthy()
  expect(mine).toHaveBeenLastCalledWith('active', 'next')
})

it('shows only available schedule data for another applicant’s pending booking', async () => {
  vi.spyOn(scheduleApi, 'getSchedule').mockResolvedValue({ spaces: [{ space_id: 1, name: 'Зал А', capacity: 25 }], items: [{ booking_id: 12, space_id: 1, title: booking.title, status: 'pending', starts_at: booking.starts_at, ends_at: booking.ends_at, is_mine: false, owner_name: 'Мария Петрова' }] })
  const mine = vi.spyOn(bookingApi, 'getMyBookings')
  const admin = vi.spyOn(bookingApi, 'getAdminBookings')
  const feed = vi.spyOn(api, 'getBookingFeed')
  render(<MemoryRouter><SessionContext.Provider value={{ user: { user_id: 1, role: 'student' }, setUser: vi.fn() }}><SchedulePage /></SessionContext.Provider></MemoryRouter>)
  fireEvent.click(await screen.findByRole('button', { name: /Открыть заявку «Встреча клуба»/ }))
  const dialog = await screen.findByRole('dialog', { name: 'Встреча клуба' })
  expect(await within(dialog).findByText(/Подробные сведения этой заявки недоступны/)).toBeTruthy()
  expect(within(dialog).getByText('Мария Петрова')).toBeTruthy()
  expect(within(dialog).queryByText('Для чего')).toBeNull()
  expect(mine).not.toHaveBeenCalled()
  expect(admin).not.toHaveBeenCalled()
  expect(feed).not.toHaveBeenCalled()
})

it('keeps schedule information visible on a detail request error and supports retry', async () => {
  const load = vi.fn().mockRejectedValueOnce(new Error('Сбой загрузки')).mockResolvedValueOnce(booking)
  render(<BookingDetailsModal booking={{ booking_id: 12, title: booking.title, space: booking.space, starts_at: booking.starts_at, ends_at: booking.ends_at, status: 'approved' }} loadDetails={load} onClose={vi.fn()} />)
  const dialog = await screen.findByRole('dialog', { name: 'Встреча клуба' })
  expect(within(dialog).getByText('Зал А')).toBeTruthy()
  fireEvent.click(await within(dialog).findByRole('button', { name: 'Попробовать снова' }))
  expect(await within(dialog).findByText('Подготовка нового проекта')).toBeTruthy()
  expect(load).toHaveBeenCalledTimes(2)
})
