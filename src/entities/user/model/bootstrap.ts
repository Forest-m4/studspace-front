import bridge from '@vkontakte/vk-bridge'
import { authSync, getMe } from '../api/user-api'
import type { SessionUser } from './session-context'
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  return Promise.race([promise, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Не удалось получить профиль VK. Откройте приложение заново.')), ms) })]).finally(() => clearTimeout(timer))
}
let startup: Promise<SessionUser> | undefined
export function initializeSession(): Promise<SessionUser> {
  startup ??= (async () => {
    if (bridge.isEmbedded() || bridge.isWebView()) {
      await withTimeout(bridge.send('VKWebAppInit'), 8000)
      const vkUser = await withTimeout(bridge.send('VKWebAppGetUserInfo'), 8000)
      await authSync({ first_name: vkUser.first_name, last_name: vkUser.last_name, photo_url: vkUser.photo_200 })
    }
    return getMe()
  })().catch(error => { startup = undefined; throw error })
  return startup
}
