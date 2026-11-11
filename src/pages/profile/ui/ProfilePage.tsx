import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_STUDENT_PROFILE } from '@/entities/profile'
import type { StudentProfile } from '@/entities/profile'
import { userApi } from '@/entities/user'
import { ProfileEditor } from '@/features/edit-profile'
import { mapApiUserToStudentProfile } from '@/shared/api/adapters'
import { routes } from '@/shared/config'
import { ConfirmSaveModal } from '@/widgets/confirm-save-modal'

export interface ProfilePageProps {
  onClose?: () => void
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
  const navigate = useNavigate()
  const [savedProfile, setSavedProfile] = useState<StudentProfile>(MOCK_STUDENT_PROFILE)
  const [draftProfile, setDraftProfile] = useState<StudentProfile>(MOCK_STUDENT_PROFILE)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(routes.home)
    }
  }

  useEffect(() => {
    userApi
      .getMe()
      .then((me) => {
        if (!me) return
        const profile = mapApiUserToStudentProfile(me)
        setSavedProfile(profile)
        setDraftProfile(profile)
      })
      .catch(() => undefined)
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

    handleClose()
  }

  const handleSave = async () => {
    const me = await userApi.patchMe({
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
    handleClose()
  }

  const handleDiscard = () => {
    setDraftProfile(savedProfile)
    setIsLeaveModalOpen(false)
    handleClose()
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
