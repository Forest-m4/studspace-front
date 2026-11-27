import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { NewBookingPage } from '@/pages/new-booking'
import { SessionContext } from '@/entities/user/model/session-context'
import { bookingApi } from '@/entities/booking'
import { spaceApi } from '@/entities/space'
import { scheduleApi } from '@/entities/schedule'
import { ApiRequestError } from '@/shared/api/errors'

afterEach(() => { cleanup(); vi.restoreAllMocks() })
beforeEach(() => { vi.spyOn(scheduleApi, 'getSchedule').mockResolvedValue({ items: [] }) })

it('keeps the entered booking after a server refusal, and navigates only on success', async () => {
  vi.spyOn(spaceApi, 'getSpaces').mockResolvedValue([{ space_id: 2, name: 'Зал Б', capacity: 8 }])
  vi.spyOn(spaceApi, 'getSpaceAvailability').mockResolvedValue({ space_id: 2, date: '2099-12-01', open_time: '09:00', close_time: '22:00', slot_step_min: 30, busy: [] })
  const create = vi.spyOn(bookingApi, 'createBooking').mockRejectedValueOnce(new ApiRequestError(409, 'Время уже занято')).mockResolvedValueOnce({ booking_id: 8 })
  const router = createMemoryRouter([{ path: '/bookings/new', element: <NewBookingPage /> }, { path: '/bookings', element: <h1>Ваши заявки</h1> }], { initialEntries: ['/bookings/new?spaceId=2&date=2099-12-01&from=15:00&to=16:00'] })
  const setUser = vi.fn()
  render(<SessionContext.Provider value={{ user: { user_id: 1, first_name: 'Анна', last_name: 'Казак' }, setUser }}><RouterProvider router={router} /></SessionContext.Provider>)
  const firstName = await screen.findByRole('textbox', { name: 'Имя', exact: true }) as HTMLInputElement
  const lastName = screen.getByRole('textbox', { name: 'Фамилия', exact: true }) as HTMLInputElement
  expect(firstName.value).toBe('Анна')
  expect(lastName.value).toBe('Казак')
  fireEvent.change(firstName, { target: { value: '  Мария  ' } })
  fireEvent.change(lastName, { target: { value: 'Петрова-Соколова' } })
  fireEvent.change(await screen.findByLabelText('Название мероприятия'), { target: { value: 'Встреча клуба' } })
  fireEvent.change(screen.getByLabelText('Для чего'), { target: { value: 'Обсудить проект' } })
  const submit = screen.getByRole('button', { name: 'Отправить заявку' })
  await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(false))
  fireEvent.click(submit)
  expect(await screen.findByRole('alert')).toBeTruthy()
  expect(router.state.location.pathname).toBe('/bookings/new')
  expect(firstName.value).toBe('  Мария  ')
  expect(lastName.value).toBe('Петрова-Соколова')
  expect((screen.getByLabelText('Название мероприятия') as HTMLInputElement).value).toBe('Встреча клуба')
  fireEvent.click(submit)
  await screen.findByRole('heading', { name: 'Ваши заявки' })
  expect(create).toHaveBeenLastCalledWith(expect.objectContaining({ first_name: 'Мария', last_name: 'Петрова-Соколова', title: 'Встреча клуба', starts_at: '2099-12-01T15:00:00+03:00' }))
  expect(setUser).not.toHaveBeenCalled()
})

it.each(['initial', 'appeared'] as const)('blocks a pending application interval even when it %s in the schedule', async state => {
  vi.spyOn(spaceApi, 'getSpaces').mockResolvedValue([{ space_id: 2, name: 'Зал Б', capacity: 8 }])
  vi.spyOn(spaceApi, 'getSpaceAvailability').mockResolvedValue({ space_id: 2, date: '2099-12-01', open_time: '09:00', close_time: '22:00', slot_step_min: 30, busy: [] })
  const pending = { booking_id: 99, status: 'pending' as const, space_id: 2, starts_at: '2099-12-01T15:00:00+03:00', ends_at: '2099-12-01T17:00:00+03:00' }
  vi.mocked(scheduleApi.getSchedule).mockResolvedValue({ items: [pending] })
  if (state === 'appeared') vi.mocked(scheduleApi.getSchedule).mockResolvedValueOnce({ items: [] })
  const create = vi.spyOn(bookingApi, 'createBooking')
  const router = createMemoryRouter([{ path: '/bookings/new', element: <NewBookingPage /> }], { initialEntries: ['/bookings/new?spaceId=2&date=2099-12-01&from=15:30&to=16:00'] })
  render(<SessionContext.Provider value={{ user: { user_id: 1, first_name: 'Анна', last_name: 'Казак' }, setUser: vi.fn() }}><RouterProvider router={router} /></SessionContext.Provider>)
  fireEvent.change(await screen.findByLabelText('Название мероприятия'), { target: { value: 'Новая встреча' } })
  fireEvent.change(screen.getByLabelText('Для чего'), { target: { value: 'Обсудить проект' } })
  const submit = screen.getByRole('button', { name: 'Отправить заявку' })
  await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(false))
  fireEvent.click(submit)
  expect(await screen.findByText('Выбранное время уже занято')).toBeTruthy()
  expect(create).not.toHaveBeenCalled()
  expect(router.state.location.pathname).toBe('/bookings/new')
})
