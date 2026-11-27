import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { errorMessage } from '@/shared/api/errors'
type Page<T> = { items?: T[]; next_cursor?: string; counters?: { new?: number } }
export function usePagedData<T>(load: (cursor?: string) => Promise<Page<T>>, key: string) {
  const loader = useRef(load)
  useLayoutEffect(() => { loader.current = load })
  const request = useRef<AbortController | undefined>(undefined)
  const morePending = useRef(false)
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<{ key: string; revision: number; items: T[]; more: boolean; error?: string; moreError?: string; cursor?: string; newCount?: number }>({ key: '', revision: -1, items: [], more: false })
  useEffect(() => {
    const controller = new AbortController()
    request.current = controller
    morePending.current = false
    loader.current().then(page => {
      if (!controller.signal.aborted) setState({ key, revision, items: page.items ?? [], more: false, cursor: page.next_cursor, newCount: page.counters?.new })
    }).catch(reason => {
      if (!controller.signal.aborted) setState({ key, revision, items: [], more: false, error: errorMessage(reason) })
    })
    return () => controller.abort()
  }, [key, revision])
  const ready = state.key === key && state.revision === revision
  const current = ready ? state : { key, revision, items: [], more: false, cursor: undefined, error: undefined, moreError: undefined, newCount: undefined }
  const loadMore = async () => {
    const controller = request.current
    if (!current.cursor || morePending.current || !ready || !controller || controller.signal.aborted) return
    morePending.current = true
    setState(previous => ({ ...previous, more: true, moreError: undefined }))
    try {
      const page = await loader.current(current.cursor)
      if (!controller.signal.aborted) setState(previous => ({ ...previous, items: [...previous.items, ...(page.items ?? [])], cursor: page.next_cursor, more: false, newCount: page.counters?.new ?? previous.newCount }))
    } catch (reason) {
      if (!controller.signal.aborted) setState(previous => ({ ...previous, more: false, moreError: errorMessage(reason) }))
    } finally { if (!controller.signal.aborted) morePending.current = false }
  }
  return { ...current, loading: !ready, reload: () => setRevision(value => value + 1), loadMore }
}
