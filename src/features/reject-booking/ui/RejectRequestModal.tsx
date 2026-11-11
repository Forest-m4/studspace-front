import { useState } from 'react'
import { X } from 'lucide-react'
import type { BookingRequest } from '@/entities/booking-request'

const REJECT_REASON_LIMIT = 300

export interface RejectRequestModalProps {
  request: BookingRequest
  onClose: () => void
  onSubmit: (reason: string) => void
}

export function RejectRequestModal({ request, onClose, onSubmit }: RejectRequestModalProps) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 bg-black/25 flex items-end justify-center px-4 pb-4">
      <div className="max-w-160 w-full rounded-3xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[36px] leading-none font-bold text-brand-dark">Отклонить заявку</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-[#f3f3f8] text-brand-muted inline-flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 rounded-2xl bg-[#f4f4f8] p-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#eeedfc] text-brand-primary text-[14px] font-semibold inline-flex items-center justify-center">
            {request.applicantInitials}
          </div>
          <div>
            <p className="text-[16px] font-semibold text-brand-dark">
              {request.lastName} {request.firstName}
            </p>
            <p className="text-[13px] text-brand-muted">
              Сб, 18 окт · {request.fromTime}-{request.toTime}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[13px] text-brand-muted">Причина отказа</p>
        <div className="mt-2 rounded-2xl bg-[#f4f4f8] px-3 py-2 border border-transparent focus-within:border-[#cbcaf5]">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value.slice(0, REJECT_REASON_LIMIT))}
            className="w-full min-h-24 resize-none bg-transparent text-[16px] leading-6 text-brand-dark outline-none"
            placeholder="Укажите причину"
          />
          <p className="text-[12px] text-brand-muted text-right">
            {reason.length} / {REJECT_REASON_LIMIT}
          </p>
        </div>

        <p className="mt-2 text-[13px] text-brand-muted">Студент увидит эту причину в своих заявках</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl bg-[#f6f6fb] text-brand-dark text-[16px] font-medium hover:bg-[#f2eff9] transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => onSubmit(reason.trim())}
            className="h-11 rounded-2xl bg-[#cf4f45] text-white text-[16px] font-medium hover:bg-[#bf463d] transition-colors"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}
