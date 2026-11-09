import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, Check, CircleCheck, Clock3 } from 'lucide-react'
import { REQUEST_TABS } from '@/entities/booking-request'
import type { BookingRequest, RequestTab } from '@/entities/booking-request'
import { mapApiAdminBookingToRequest } from '@/shared/api/adapters'
import {
  approveAdminBooking,
  cancelAdminBooking,
  getAdminBookings,
  rejectAdminBooking,
  returnAdminBookingToReview,
} from '@/shared/api/studspace'
import { RejectRequestModal } from '@/widgets/reject-request-modal'

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] leading-none text-brand-muted">{label}</span>
      <div className="rounded-xl bg-[#f4f4f8] px-3 py-2 text-[15px] text-brand-dark leading-tight">{children}</div>
    </div>
  )
}

function RequestCard({
  request,
  onReject,
  onApprove,
  onSecondary,
}: {
  request: BookingRequest
  onReject: (request: BookingRequest) => void
  onApprove: (request: BookingRequest) => void
  onSecondary: (request: BookingRequest) => void
}) {
  const statusBadgeClass =
    request.status === 'approved'
      ? 'bg-[#daf6e8] text-[#2e9e6b]'
      : request.status === 'rejected'
        ? 'bg-[#fde8eb] text-[#d85068]'
        : ''

  return (
    <article className="rounded-3xl bg-white p-3 border border-black/[0.03] shadow-[0_2px_6px_rgba(31,26,61,0.03)]">
      <div className="flex items-start gap-2">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#eeedfc] flex items-center justify-center text-[14px] font-semibold text-brand-primary">
          {request.applicantInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-brand-muted">Заявка</span>
              {request.status !== 'new' && (
                <span className={`text-[12px] px-2 py-0.5 rounded-full font-medium ${statusBadgeClass}`}>
                  {request.status === 'approved' ? 'Одобрена' : 'Отклонена'}
                </span>
              )}
            </div>
            <span className="text-[13px] text-brand-muted">{request.createdAtLabel}</span>
          </div>
          <button className="text-[13px] text-brand-primary hover:text-[#5c5adf] transition-colors">Профиль ВК ↗</button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] leading-none text-brand-muted">Помещение</span>
          <div className="rounded-xl bg-[#f4f4f8] px-3 py-2 flex items-center justify-between gap-2">
            <span className="text-[15px] text-brand-dark leading-tight">• {request.spaceName}</span>
            <span className="text-[13px] text-brand-muted">{request.capacityLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Фамилия">{request.lastName}</Field>
          <Field label="Имя">{request.firstName}</Field>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[13px] leading-none text-brand-muted">Дата</span>
          <div className="rounded-xl bg-[#f4f4f8] px-3 py-2 text-[15px] text-brand-dark leading-tight flex items-center gap-2">
            <CalendarDays size={14} className="text-brand-muted" />
            {request.dateLabel}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] leading-none text-brand-muted">С</span>
            <div className="rounded-xl bg-[#f4f4f8] px-3 py-2 text-[15px] text-brand-dark leading-tight flex items-center gap-2">
              <Clock3 size={14} className="text-brand-muted" />
              {request.fromTime}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] leading-none text-brand-muted">До</span>
            <div className="rounded-xl bg-[#f4f4f8] px-3 py-2 text-[15px] text-brand-dark leading-tight flex items-center gap-2">
              <Clock3 size={14} className="text-brand-muted" />
              {request.toTime}
            </div>
          </div>
        </div>

        <Field label="Для чего">{request.purpose}</Field>

        <div className="flex flex-col gap-1">
          <span className="text-[13px] leading-none text-brand-muted">Сколько человек</span>
          <div className="rounded-xl bg-[#f4f4f8] px-3 py-2 flex items-center justify-between gap-2">
            <span className="text-[15px] text-brand-dark leading-tight">{request.peopleCount}</span>
            <span className="text-[13px] text-brand-muted">из {request.peopleLimit}</span>
          </div>
        </div>

        {request.warningText && (
          <div className="rounded-xl bg-[#fff7e8] text-[#c9871f] px-3 py-2 text-[13px] leading-4 flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            {request.warningText}
          </div>
        )}

        {request.decisionReason && (
          <div className="rounded-xl bg-[#ffeef1] text-[#9f5564] px-3 py-2">
            <p className="text-[12px] uppercase tracking-[0.06em] font-semibold">Причина</p>
            <p className="mt-1 text-[13px] leading-4">{request.decisionReason}</p>
          </div>
        )}

        {request.decisionMeta && (
          <div className="border-t border-[#f0eff4] pt-2 text-[12px] text-brand-muted flex items-center gap-1.5">
            <CircleCheck size={13} className="text-[#52b683]" />
            {request.decisionMeta}
          </div>
        )}

        {request.status === 'new' ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onReject(request)}
              className="h-9 rounded-xl bg-[#f6f6fb] text-[#dd596c] text-[15px] font-medium hover:bg-[#f2eff9] transition-colors"
            >
              Отклонить
            </button>
            <button
              onClick={() => onApprove(request)}
              className="h-9 rounded-xl bg-brand-primary text-white text-[15px] font-medium hover:bg-[#5c5adf] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Check size={14} />
              Одобрить
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSecondary(request)}
            className={`h-9 rounded-xl text-[15px] font-medium transition-colors ${
              request.status === 'approved'
                ? 'bg-[#f8f8fc] text-[#dd596c] hover:bg-[#f2eff9]'
                : 'bg-[#f6f6fb] text-[#8a88a5] hover:bg-[#f2eff9]'
            }`}
          >
            {request.status === 'approved' ? 'Отменить бронь' : 'Вернуть на рассмотрение'}
          </button>
        )}
      </div>
    </article>
  )
}

export function BookingRequestsBoard() {
  const [activeTab, setActiveTab] = useState<RequestTab>('new')
  const [itemsByTab, setItemsByTab] = useState<Record<RequestTab, BookingRequest[]>>({
    new: [],
    approved: [],
    rejected: [],
  })
  const [rejectingRequest, setRejectingRequest] = useState<BookingRequest | null>(null)

  const loadTab = async (tab: RequestTab) => {
    const data = await getAdminBookings(tab)
    setItemsByTab((prev) => ({
      ...prev,
      [tab]: (data?.items ?? []).map(mapApiAdminBookingToRequest),
    }))
  }

  useEffect(() => {
    loadTab(activeTab).catch(() => undefined)
  }, [activeTab])

  const requests = useMemo(() => itemsByTab[activeTab], [activeTab, itemsByTab])

  return (
    <section className="flex flex-col gap-3">
      <div className="rounded-2xl bg-white p-1 grid grid-cols-3 gap-1">
        {REQUEST_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`h-8 rounded-xl text-[14px] transition-colors ${
              activeTab === tab.key
                ? 'bg-brand-primary text-white'
                : 'text-brand-dark hover:bg-[#f2f2f8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onReject={setRejectingRequest}
            onApprove={(current) => {
              if (!current.bookingId) return
              approveAdminBooking(current.bookingId)
                .then(() => loadTab(activeTab))
                .catch(() => undefined)
            }}
            onSecondary={(current) => {
              if (!current.bookingId) return
              const call = current.status === 'approved'
                ? cancelAdminBooking(current.bookingId)
                : returnAdminBookingToReview(current.bookingId)

              call.then(() => loadTab(activeTab)).catch(() => undefined)
            }}
          />
        ))}
      </div>

      {rejectingRequest && (
        <RejectRequestModal
          request={rejectingRequest}
          onClose={() => setRejectingRequest(null)}
          onSubmit={(reason) => {
            const request = rejectingRequest
            setRejectingRequest(null)
            if (!request.bookingId) return
            rejectAdminBooking(request.bookingId, reason)
              .then(() => loadTab(activeTab))
              .catch(() => undefined)
          }}
        />
      )}
    </section>
  )
}
