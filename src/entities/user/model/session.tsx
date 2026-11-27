import { useState } from 'react'
import type { ReactNode } from 'react'
import { ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { initializeSession } from './bootstrap'
import { SessionContext } from './session-context'
import type { SessionUser } from './session-context'
export function SessionProvider({ children, loadSession = initializeSession }: { children: ReactNode; loadSession?: () => Promise<SessionUser> }) {
  const state = useAsyncData(loadSession, 'session')
  const [updatedUser, setUser] = useState<SessionUser>()
  const user = updatedUser ?? state.data
  if (!user) return <main className="page-shell pt-12"><h1 className="mb-4 text-[26px] font-bold">StudSpace</h1>{state.error ? <ErrorState message={state.error} onRetry={state.reload} /> : <LoadingState label="Входим в приложение…" />}</main>
  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>
}
