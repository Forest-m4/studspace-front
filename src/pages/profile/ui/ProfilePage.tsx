import { useEffect, useMemo, useState } from 'react'
import { MOCK_STUDENT_PROFILE } from '@/entities/profile'
import type { StudentProfile } from '@/entities/profile'
import { ProfileEditor } from '@/widgets/profile-editor'
import { ConfirmSaveModal } from '@/widgets/confirm-save-modal'
import { mapApiUserToStudentProfile } from '@/shared/api/adapters'
import { getMe, patchMe } from '@/shared/api/studspace'

export interface ProfilePageProps {
  onClose: () => void
}

function isProfileChanged(current: StudentProfile, initial: StudentProfile) {
  return (
    current.firstName !== initial.firstName ||
    current.lastName !== initial.lastName ||
    current.middleName !== initial.middleName ||
    current.status !== initial.status
  )
}

export function ProfilePage({ onClose }: ProfilePageProps) {
  const [savedProfile, setSavedProfile] = useState<StudentProfile>(MOCK_STUDENT_PROFILE)
  const [draftProfile, setDraftProfile] = useState<StudentProfile>(MOCK_STUDENT_PROFILE)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  useEffect(() => {
    let active = true

    const load = async () => {
      const me = await getMe()
      if (!me || !active) return

      const profile = mapApiUserToStudentProfile(me)
      setSavedProfile(profile)
      setDraftProfile(profile)
    }

    load().catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  const hasChanges = useMemo(
    () => isProfileChanged(draftProfile, savedProfile),
    [draftProfile, savedProfile],
  )

  const handleBack = () => {
    if (hasChanges) {
      setIsLeaveModalOpen(true)
      return
    }

    onClose()
  }

  const handleSave = async () => {
    const me = await patchMe({
      patronymic: draftProfile.middleName,
      occupation: draftProfile.status,
    })

    const nextSaved = me ? mapApiUserToStudentProfile(me) : draftProfile
    setSavedProfile(nextSaved)
    setDraftProfile(nextSaved)
    setIsLeaveModalOpen(false)
  }

  const handleSaveAndClose = async () => {
    await handleSave()
    onClose()
  }

  const handleDiscard = () => {
    setDraftProfile(savedProfile)
    setIsLeaveModalOpen(false)
    onClose()
  }

  return (
    <>
        <ProfileEditor
          profile={draftProfile}
          onChange={setDraftProfile}
          onBack={handleBack}
          onSave={() => {
            handleSave().catch(() => undefined)
          }}
        />
      {isLeaveModalOpen && (
        <ConfirmSaveModal
          onSave={() => {
            handleSaveAndClose().catch(() => undefined)
          }}
          onDiscard={handleDiscard}
          onClose={() => setIsLeaveModalOpen(false)}
        />
      )}
    </>
  )
}
