import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { errorMessage } from '@/shared/api/errors'
export function useAsyncData<T>(load: (signal: AbortSignal) => Promise<T>, key: string) {
  const loader = useRef(load)
  useLayoutEffect(() => { loader.current = load })
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<{ key: string; revision: number; data?: T; error?: string }>({ key: '', revision: -1 })
  useEffect(() => {
    const controller = new AbortController()
    loader.current(controller.signal).then(data => {
      if (!controller.signal.aborted) setState({ key, revision, data })
    }).catch(error => {
      if (!controller.signal.aborted) setState({ key, revision, error: errorMessage(error) })
    })
    return () => controller.abort()
  }, [key, revision])
  const ready = state.key === key && state.revision === revision
  return { data: ready ? state.data : undefined, error: ready ? state.error : undefined, loading: !ready, reload: () => setRevision(value => value + 1) }
}
