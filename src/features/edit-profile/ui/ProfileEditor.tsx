import { ArrowLeft } from 'lucide-react'
import type { StudentProfile } from '@/entities/profile'
import { ErrorState } from '@/shared/ui/async-state/AsyncState'
export interface ProfileEditorProps { profile: StudentProfile; onChange: (next: StudentProfile) => void; onBack: () => void; onSave: () => void; busy?: boolean; error?: string; fields?: Record<string, string>; saved?: boolean }
export function ProfileEditor({ profile, onChange, onBack, onSave, busy, error, fields = {}, saved }: ProfileEditorProps) {
  const initials = ((profile.lastName[0] ?? '') + (profile.firstName[0] ?? '')).toUpperCase()
  return <main className="page-shell form-page flex flex-col gap-4">
    <header className="flex items-center gap-3"><button className="icon-button" aria-label="Назад" onClick={onBack} disabled={busy}><ArrowLeft size={21} /></button><h1 className="text-[22px] font-bold">Профиль</h1></header>
    <section className="flex flex-col items-center"><span className="flex size-16 items-center justify-center rounded-full bg-[#eeedfc] text-[28px] font-bold text-brand-primary">{initials}</span><p className="mt-3 text-[20px] font-semibold">{profile.lastName} {profile.firstName}</p><p className="mt-1 text-[14px] text-brand-muted">{profile.status}</p></section>
    <form onSubmit={event => { event.preventDefault(); onSave() }} className="flex flex-col gap-4" aria-busy={busy}>
      <section className="flex flex-col gap-3 rounded-3xl bg-white p-4">
        <h2 className="text-[16px] font-semibold">Личные данные</h2>
        <div className="grid grid-cols-2 gap-3"><label className="field-label">Фамилия<input className="field-input mt-2 text-brand-muted!" value={profile.lastName} readOnly /></label><label className="field-label">Имя<input className="field-input mt-2 text-brand-muted!" value={profile.firstName} readOnly /></label></div>
        <p className="text-[12px] text-brand-muted">Имя и фамилия берутся из ВКонтакте.</p>
        <label className="field-label">Отчество <span className="text-brand-muted">необязательно</span><input className="field-input mt-2" disabled={busy} maxLength={100} aria-invalid={Boolean(fields.patronymic)} value={profile.middleName} onChange={event => onChange({ ...profile, middleName: event.target.value })} />{fields.patronymic && <span className="field-error">{fields.patronymic}</span>}</label>
        <label className="field-label">Должность или статус<input className="field-input mt-2" disabled={busy} maxLength={150} aria-invalid={Boolean(fields.occupation)} value={profile.status} onChange={event => onChange({ ...profile, status: event.target.value })} />{fields.occupation && <span className="field-error">{fields.occupation}</span>}</label>
        <p className="text-[12px] text-brand-muted">Например: студент, группа · член студсовета · руководитель клуба</p>
      </section>
      <p className="text-center text-[13px] text-brand-muted">Эти данные автоматически подставляются в заявки на бронирование.</p>
      {error && <ErrorState message={error} />}
      {saved && <p role="status" className="success-message">Изменения сохранены.</p>}
      <button type="submit" className="primary-action" disabled={busy}>{busy ? 'Сохраняем…' : 'Сохранить изменения'}</button>
    </form>
  </main>
}
