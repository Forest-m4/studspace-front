import { env } from '@/shared/config'
function signedParams(raw: string) {
  const params = new URLSearchParams(raw)
  return params.has('sign') && params.has('vk_user_id') ? raw : ''
}
const initialParams = typeof window === 'undefined' ? '' : signedParams(window.location.search.slice(1))
export function getLaunchParams(): string {
  const current = typeof window === 'undefined' ? '' : signedParams(window.location.search.slice(1))
  return initialParams || current || (env.isDev ? signedParams(env.devLaunchParams) : '')
}
