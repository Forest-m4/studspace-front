export interface ConfirmSaveModalProps {
  onSave: () => void
  onDiscard: () => void
  onClose: () => void
}

export function ConfirmSaveModal({ onSave, onDiscard, onClose }: ConfirmSaveModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/25 flex items-end justify-center px-4 pb-5">
      <div className="max-w-160 w-full rounded-3xl bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[24px] leading-none font-bold text-brand-dark">Сохранить изменения?</h3>
            <p className="mt-2 text-[16px] leading-5 text-brand-muted">
              Вы изменили данные профиля. Если выйти без сохранения, изменения пропадут.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-[#f4f4f8] text-brand-muted hover:bg-[#ededf3] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={onSave}
            className="h-12 rounded-2xl bg-brand-accent text-brand-dark text-[16px] font-medium hover:bg-[#c8eb09] transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={onDiscard}
            className="h-12 rounded-2xl bg-[#f6f6fb] text-[#dd596c] text-[16px] font-medium hover:bg-[#f2eff9] transition-colors"
          >
            Не сохранять
          </button>
        </div>
      </div>
    </div>
  )
}
