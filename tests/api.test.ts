import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError } from '@/shared/api/errors'
import { createBooking, patchNotifications } from '@/shared/api/studspace'

afterEach(() => vi.unstubAllGlobals())

describe('API failures', () => {
  it('rejects a declined booking and preserves field errors for the form', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: {
      code: 'VALIDATION_ERROR', message: 'Проверьте поля', details: { fields: { title: 'Укажите название' } },
    } }), { status: 422, headers: { 'Content-Type': 'application/json' } })))
    await expect(createBooking({ space_id: 1, title: '', starts_at: '', ends_at: '', purpose: '', people_count: 1 }))
      .rejects.toMatchObject({ status: 422, fields: { title: 'Укажите название' } })
  })

  it('does not treat rejected notification settings as success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })))
    await expect(patchNotifications(true)).rejects.toBeInstanceOf(ApiRequestError)
  })
})
