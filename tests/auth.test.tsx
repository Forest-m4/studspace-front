import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { SessionProvider } from '@/entities/user/model/session'
import { useSession } from '@/entities/user/model/session-context'

afterEach(cleanup)

it('does not mount protected screens until the session and role are ready', async () => {
  let resolve: (value: { user_id: number; role: 'admin' }) => void
  const pending = new Promise<{ user_id: number; role: 'admin' }>(done => { resolve = done })
  const protectedRequest = vi.fn()
  function Screen() { const { user } = useSession(); protectedRequest(); return <p>{user.role}</p> }
  render(<SessionProvider loadSession={() => pending}><Screen /></SessionProvider>)
  expect(protectedRequest).not.toHaveBeenCalled()
  expect(screen.getByRole('status').textContent).toContain('Входим')
  await act(async () => { resolve!({ user_id: 1, role: 'admin' }); await pending })
  expect(screen.getByText('admin')).toBeTruthy()
})

it('finishes VK synchronization before fetching the protected user', async () => {
  vi.resetModules()
  let synchronized: () => void
  const sync = new Promise<void>(resolve => { synchronized = resolve })
  const getMe = vi.fn().mockResolvedValue({ user_id: 1, role: 'admin' })
  const authSync = vi.fn(() => sync)
  vi.doMock('@/entities/user/api/user-api', () => ({ getMe, authSync }))
  vi.doMock('@vkontakte/vk-bridge', () => ({ default: { isEmbedded: () => true, isWebView: () => false,
    send: vi.fn(async (method: string) => method === 'VKWebAppGetUserInfo' ? { first_name: 'Анна', last_name: 'Казак', photo_200: '' } : {}) } }))
  const { initializeSession } = await import('@/entities/user/model/bootstrap')
  const startup = initializeSession()
  await vi.waitFor(() => expect(authSync).toHaveBeenCalledOnce())
  expect(getMe).not.toHaveBeenCalled()
  synchronized!()
  await expect(startup).resolves.toMatchObject({ role: 'admin' })
  expect(getMe).toHaveBeenCalledOnce()
  vi.doUnmock('@/entities/user/api/user-api')
  vi.doUnmock('@vkontakte/vk-bridge')
})
