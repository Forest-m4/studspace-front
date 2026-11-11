import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { StudentProfile } from '@/entities/profile'

export interface ProfileEditorProps {
  profile: StudentProfile
  onChange: (next: StudentProfile) => void
  onBack: () => void
  onSave: () => void
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[13px] text-brand-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl border border-transparent bg-[#f4f4f8] px-3 text-[18px] text-brand-dark outline-none focus:border-[#c9c8f4]"
      />
    </label>
  )
}

export function ProfileEditor({ profile, onChange, onBack, onSave }: ProfileEditorProps) {
  const initials = useMemo(
    () => `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase() || 'П',
    [profile.firstName, profile.lastName],
  )

  const fullName = `${profile.lastName} ${profile.firstName}`.trim()

  return (
    <div className="max-w-160 w-full mx-auto px-4 pt-5 pb-26 flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={20} className="text-brand-dark" />
        </button>
        <h1 className="text-[34px] leading-none font-bold text-brand-dark">Профиль</h1>
      </header>

      <section className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-[#eeedfc] flex items-center justify-center text-brand-primary text-[38px] font-medium">
          {initials}
        </div>
        <p className="mt-3 text-[30px] leading-none font-semibold text-brand-dark">{fullName}</p>
        <p className="mt-1 text-[16px] text-brand-muted">{profile.status}</p>
      </section>

      <section className="rounded-3xl bg-white p-4 flex flex-col gap-3">
        <h2 className="text-[22px] leading-none font-semibold text-brand-dark">Личные данные</h2>

        <div className="grid grid-cols-2 gap-2">
          <Field
            label="Фамилия"
            value={profile.lastName}
            onChange={(lastName) => onChange({ ...profile, lastName })}
          />
          <Field
            label="Имя"
            value={profile.firstName}
            onChange={(firstName) => onChange({ ...profile, firstName })}
          />
        </div>

        <p className="text-[13px] text-brand-muted">
          <span className="text-[#4a76a8] font-medium">vk</span> {profile.vkDisplayName} - из ВКонтакте, чёрным - изменено вами
        </p>

        <Field
          label="Отчество необязательно"
          value={profile.middleName}
          onChange={(middleName) => onChange({ ...profile, middleName })}
        />

        <Field
          label="Должность или статус"
          value={profile.status}
          onChange={(status) => onChange({ ...profile, status })}
        />

        <p className="text-[13px] leading-4 text-brand-muted">
          Например: студент, группа - член студсовета - руководитель клуба
        </p>
      </section>

      <p className="text-[14px] text-brand-muted text-center">
        Эти данные автоматически подставляются в заявки на бронирование
      </p>

      <button
        type="button"
        onClick={onSave}
        className="h-12 rounded-2xl bg-brand-accent text-brand-dark text-[16px] font-semibold hover:bg-[#c8eb09] transition-colors"
      >
        Сохранить изменения
      </button>
    </div>
  )
}
