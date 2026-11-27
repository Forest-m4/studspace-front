import { describe, expect, it } from 'vitest'
import { availabilityForReschedule, createBookingPayload, includeScheduleBusy, validateBookingDraft } from '@/features/create-booking/model/booking'
import type { NewBookingDraft } from '@/entities/booking-draft'

const draft: NewBookingDraft = { spaceId: 2, firstName: 'Пользователь', lastName: 'VK', dateISO: '2026-12-01',
  dateLabel: '', fromTime: '15:00', toTime: '16:30', eventTitle: 'Защита проекта',
  purpose: 'Репетиция', peopleCount: 4, peopleLimit: 8 }
const availability = { space_id: 2, date: '2026-12-01', open_time: '09:00', close_time: '22:00',
  slot_step_min: 30, busy: [{ starts_at: '2026-12-01T13:30:00+03:00', ends_at: '2026-12-01T15:00:00+03:00' }] }
const now = new Date('2026-11-27T12:00:00Z')

describe('booking contract', () => {
  it('sends edited applicant names without modifying the VK profile', () => {
    expect(createBookingPayload({ ...draft, firstName: '  Мария ', lastName: ' Петрова-Соколова ' })).toMatchObject({ first_name: 'Мария', last_name: 'Петрова-Соколова' })
  })
  it('requires both applicant names and limits each to 100 Unicode characters', () => {
    expect(validateBookingDraft({ ...draft, firstName: ' ', lastName: 'Я'.repeat(101) }, availability, now)).toMatchObject({ first_name: expect.any(String), last_name: expect.any(String) })
    expect(validateBookingDraft({ ...draft, firstName: 'Маша', lastName: 'Я'.repeat(100) }, availability, now)).toEqual({})
  })
  it('sends the entered title and Moscow offset, independent of device timezone', () => {
    expect(createBookingPayload(draft)).toMatchObject({ title: 'Защита проекта',
      starts_at: '2026-12-01T15:00:00+03:00', ends_at: '2026-12-01T16:30:00+03:00', space_id: 2 })
  })
  it('allows touching the boundary of an occupied interval', () => {
    expect(validateBookingDraft(draft, availability, now)).toEqual({})
  })
  it('rejects a busy slot and invalid slot steps before submitting', () => {
    expect(validateBookingDraft({ ...draft, fromTime: '14:30' }, availability, now).starts_at).toBeTruthy()
    expect(validateBookingDraft({ ...draft, fromTime: '15:10' }, availability, now).starts_at).toBeTruthy()
  })
  it('requires a title, a future date, and people within actual capacity', () => {
    const errors = validateBookingDraft({ ...draft, eventTitle: ' ', dateISO: '2026-10-16', peopleCount: 9 }, availability, now)
    expect(errors.title).toBeTruthy()
    expect(errors.starts_at).toBeTruthy()
    expect(errors.people_count).toBeTruthy()
  })
})

it('allows a partial overlap with the source booking but preserves other conflicts during rescheduling', () => {
  const original = { spaceId: 2, startsAt: '2026-12-01T15:00:00+03:00', endsAt: '2026-12-01T17:00:00+03:00' }
  const available = availabilityForReschedule({ ...availability, busy: [
    { starts_at: original.startsAt, ends_at: original.endsAt },
    { starts_at: '2026-12-01T18:00:00+03:00', ends_at: '2026-12-01T19:00:00+03:00' },
  ] }, original)
  expect(validateBookingDraft({ ...draft, fromTime: '15:30', toTime: '17:30' }, available, now)).toEqual({})
  expect(validateBookingDraft({ ...draft, fromTime: '17:30', toTime: '18:30' }, available, now).starts_at).toBeTruthy()
})

it('preserves another pending booking on the original slot while rescheduling and ignores other rooms', () => {
  const original = { spaceId: 2, startsAt: '2026-12-01T15:00:00+03:00', endsAt: '2026-12-01T17:00:00+03:00' }
  const available = availabilityForReschedule({ ...availability, busy: [{ starts_at: original.startsAt, ends_at: original.endsAt }] }, original)
  const items = [
    { booking_id: 1, space_id: 2, status: 'approved' as const, starts_at: original.startsAt, ends_at: original.endsAt },
    { booking_id: 2, space_id: 2, status: 'pending' as const, starts_at: original.startsAt, ends_at: original.endsAt },
    { booking_id: 3, space_id: 1, status: 'pending' as const, starts_at: '2026-12-01T17:00:00+03:00', ends_at: '2026-12-01T18:00:00+03:00' },
  ]
  const merged = includeScheduleBusy(available, items, 1)
  expect(validateBookingDraft(draft, merged, now).starts_at).toBe('Выбранное время уже занято')
  expect(validateBookingDraft({ ...draft, fromTime: '17:00', toTime: '17:30' }, merged, now)).toEqual({})
  expect(includeScheduleBusy(available, [items[0]], 1).busy).toEqual([])
})
