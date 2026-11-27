export function LoadingState({ label = 'Загружаем данные…' }: { label?: string }) {
  return <div className="rounded-3xl bg-white p-6 text-center text-brand-muted" role="status"><span className="loading-dot" />{label}</div>
}
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="rounded-2xl bg-[#fff0f2] p-4 text-[14px] text-[#9a3548]">
    <p>{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-3 font-semibold underline underline-offset-4">Попробовать снова</button>}
  </div>
}
export function EmptyState({ title, text }: { title: string; text?: string }) {
  return <div className="rounded-3xl bg-white p-6 text-center"><p className="font-bold text-[20px]">{title}</p>{text && <p className="mt-2 text-[14px] text-brand-muted">{text}</p>}</div>
}
