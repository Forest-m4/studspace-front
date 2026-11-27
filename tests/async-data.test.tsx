import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { usePagedData } from '@/shared/lib/usePagedData'
afterEach(cleanup)
function deferred<T>() { let resolve: (value: T) => void; return { promise: new Promise<T>(done => { resolve = done }), resolve: (value: T) => resolve(value) } }

it('ignores the previous date response when the selected date changes', async () => {
  const first = deferred<string>(), second = deferred<string>()
  const { result, rerender } = renderHook(({ date }) => useAsyncData(() => date === 'a' ? first.promise : second.promise, date), { initialProps: { date: 'a' } })
  rerender({ date: 'b' })
  await act(async () => { second.resolve('current date'); await second.promise })
  await act(async () => { first.resolve('stale date'); await first.promise })
  expect(result.current.data).toBe('current date')
})

it('does not append a previous tab page after switching tabs', async () => {
  const more = deferred<{ items: number[] }>()
  const { result, rerender } = renderHook(({ tab }) => usePagedData(cursor => cursor ? more.promise : Promise.resolve({ items: [tab], next_cursor: tab === 1 ? 'next' : undefined }), String(tab)), { initialProps: { tab: 1 } })
  await act(async () => {})
  let pending: Promise<void>
  act(() => { pending = result.current.loadMore() })
  rerender({ tab: 2 })
  await act(async () => {})
  await act(async () => { more.resolve({ items: [99] }); await pending! })
  expect(result.current.items).toEqual([2])
})
