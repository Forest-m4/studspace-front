import { useEffect, useRef, useState } from 'react'
import { useBlocker, useLocation, useNavigate } from 'react-router-dom'
import { userApi } from '@/entities/user'
import { useSession } from '@/entities/user/model/session-context'
import { ProfileEditor } from '@/features/edit-profile'
import { mapApiUserToStudentProfile } from '@/shared/api/adapters'
import { ApiRequestError, errorMessage } from '@/shared/api/errors'
import { routes } from '@/shared/config'
import { ConfirmSaveModal } from '@/widgets/confirm-save-modal'
export interface ProfilePageProps { onClose?: () => void }
export function ProfilePage({ onClose }: ProfilePageProps) {
  const { user, setUser } = useSession()
  const initial = mapApiUserToStudentProfile(user)
  const [saved, setSaved] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [leave, setLeave] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const allowNavigation = useRef(false)
  const dirty = draft.middleName !== saved.middleName || draft.status !== saved.status
  const blocker = useBlocker(() => dirty && !allowNavigation.current)
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])
  const close = () => {
    if (onClose) onClose()
    else if (location.key === 'default') navigate(routes.home)
    else navigate(-1)
  }
  const save = async () => {
    if (busy) return false
    setBusy(true); setError(''); setFields({}); setSuccess(false)
    try {
      const me = await userApi.patchMe({ patronymic: draft.middleName.trim(), occupation: draft.status.trim() })
      const profile = mapApiUserToStudentProfile(me)
      setUser(me); setSaved(profile); setDraft(profile); setSuccess(true)
      return true
    } catch (reason) {
      setError(errorMessage(reason)); if (reason instanceof ApiRequestError) setFields(reason.fields)
      return false
    } finally { setBusy(false) }
  }
  const exit = () => { allowNavigation.current = true; setLeave(false); if (blocker.state === 'blocked') blocker.proceed(); else close() }
  return <>
    <ProfileEditor profile={draft} onChange={next => { setDraft(next); setSuccess(false); setError(''); setFields({}) }}
      onBack={() => { if (dirty) setLeave(true); else close() }} onSave={() => { void save() }} busy={busy} error={leave || blocker.state === 'blocked' ? undefined : error} fields={fields} saved={success} />
    {(leave || blocker.state === 'blocked') && <ConfirmSaveModal busy={busy} error={error} onClose={() => { setLeave(false); if (blocker.state === 'blocked') blocker.reset() }}
      onDiscard={() => { setDraft(saved); exit() }} onSave={() => { void save().then(ok => { if (ok) exit() }) }} />}
  </>
}
