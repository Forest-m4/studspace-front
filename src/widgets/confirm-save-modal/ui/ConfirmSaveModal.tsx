import { ErrorState } from '@/shared/ui/async-state/AsyncState'
import { Modal } from '@/shared/ui/modal/Modal'
export interface ConfirmSaveModalProps { onSave: () => void; onDiscard: () => void; onClose: () => void; busy?: boolean; error?: string }
export function ConfirmSaveModal({ onSave, onDiscard, onClose, busy, error }: ConfirmSaveModalProps) {
  return <Modal title="Сохранить изменения?" onClose={onClose} busy={busy}>
    <p className="text-[15px] text-brand-muted">Вы изменили данные профиля. Если выйти без сохранения, изменения пропадут.</p>
    {error && <div className="mt-3"><ErrorState message={error} /></div>}
    <div className="mt-4 flex flex-col gap-2"><button className="primary-action" disabled={busy} onClick={onSave}>{busy ? 'Сохраняем…' : 'Сохранить'}</button><button className="secondary-action text-[#bd3f56]!" disabled={busy} onClick={onDiscard}>Не сохранять</button></div>
  </Modal>
}
