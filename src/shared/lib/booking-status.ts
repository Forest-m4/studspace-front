export function bookingStatusLabel(status?: string, cancelledBy?: string) {
  return ({ pending: 'На рассмотрении', approved: 'Подтверждена', rejected: 'Отклонена', completed: 'Завершена',
    expired: 'Срок заявки истёк', withdrawn: 'Заявка отозвана', cancelled: cancelledBy === 'user' ? 'Отменена вами' : cancelledBy === 'admin' ? 'Отменена администратором' : 'Отменена' } as Record<string, string>)[status ?? ''] || 'Неизвестный статус'
}
export function bookingStatusClass(status?: string) {
  return status === 'approved' ? 'bg-[#daf6e8] text-[#277b56]' : status === 'rejected' ? 'bg-[#fde8eb] text-[#aa384f]' : status === 'pending' ? 'bg-[#eeedfc] text-brand-primary' : 'bg-[#f0f0f5] text-brand-muted'
}
