import bridge from '@vkontakte/vk-bridge'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceApi } from '@/entities/space'
import { userApi } from '@/entities/user'
import { useSession } from '@/entities/user/model/session-context'
import { mapApiHomeToSpaces, mapApiHomeToTodayBookings, mapApiUserToUser } from '@/shared/api/adapters'
import { errorMessage } from '@/shared/api/errors'
import { routes } from '@/shared/config'
import { useAsyncData } from '@/shared/lib/useAsyncData'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/async-state/AsyncState'
import { AppHeader } from '@/widgets/app-header'
import { SpacesListSection } from '@/widgets/spaces-list'
import { TodayBookingsSection } from '@/widgets/today-bookings'

export function HomePage() {
  const navigate = useNavigate()
  const { user, setUser } = useSession()
  const data = useAsyncData(() => spaceApi.getHome(), 'home')
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const toggleNotifications = async () => {
    if (updating) return
    setUpdating(true); setError('')
    try {
      const allowed = !user.notifications_allowed
      if (allowed && (bridge.isEmbedded() || bridge.isWebView())) await bridge.send('VKWebAppAllowNotifications')
      await userApi.patchNotifications(allowed)
      setUser({ ...user, notifications_allowed: allowed })
    } catch (reason) { setError(errorMessage(reason)) }
    finally { setUpdating(false) }
  }
  return <main className="page-shell flex flex-col gap-4">
    <AppHeader user={mapApiUserToUser(user)} hasNotifications={user.notifications_allowed}
      onProfileClick={() => navigate(routes.profile)} onNotificationsClick={() => { void toggleNotifications() }} notificationsBusy={updating} />
    {error && <ErrorState message={error} />}
    {data.loading ? <LoadingState /> : data.error ? <ErrorState message={data.error} onRetry={data.reload} /> : <>
      {(data.data?.today?.items?.length ?? 0) > 0 ? <TodayBookingsSection bookings={mapApiHomeToTodayBookings(data.data)} onViewAll={() => navigate(routes.schedule)} />
        : <section><h2 className="mb-2 text-[20px] font-bold">Сегодня</h2><EmptyState title="Сегодня броней нет" text="Выберите помещение и отправьте заявку." /></section>}
      {(data.data?.spaces?.length ?? 0) > 0 ? <SpacesListSection spaces={mapApiHomeToSpaces(data.data)} onBook={spaceId => navigate(routes.newBooking + '?spaceId=' + spaceId)} />
        : <EmptyState title="Помещения пока недоступны" />}
    </>}
  </main>
}
