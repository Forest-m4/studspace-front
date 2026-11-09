import { useMemo, useState } from 'react'
import { MOCK_STUDENT_PROFILE } from '@/entities/profile'
import type { StudentProfile } from '@/entities/profile'
import { ProfileEditor } from '@/widgets/profile-editor'
import { ConfirmSaveModal } from '@/widgets/confirm-save-modal'

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

  const handleSave = () => {
    setSavedProfile(draftProfile)
    setIsLeaveModalOpen(false)
  }

  const handleSaveAndClose = () => {
    handleSave()
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
        onSave={handleSave}
      />
      {isLeaveModalOpen && (
        <ConfirmSaveModal
          onSave={handleSaveAndClose}
          onDiscard={handleDiscard}
          onClose={() => setIsLeaveModalOpen(false)}
        />
      )}
    </>
  )
}
