import { createContext, useContext } from 'react'
import type { components } from '@/shared/api/schema'
export type SessionUser = components['schemas']['entities.User']
export const SessionContext = createContext<{ user: SessionUser; setUser: (user: SessionUser) => void } | null>(null)
export function useSession() {
  const session = useContext(SessionContext)
  if (!session) throw new Error('SessionProvider is required')
  return session
}
