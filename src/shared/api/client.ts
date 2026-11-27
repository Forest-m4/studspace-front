import createClient from 'openapi-fetch'
import { env } from '@/shared/config'
import { getLaunchParams } from './launchParams'
import { ApiRequestError, responseError } from './errors'
import type { components, paths } from './schema'

export type ApiError = components['schemas']['errors.ErrorBody']
export const api = createClient<paths>({
  baseUrl: new URL(env.apiBaseUrl, window.location.origin).href.replace(/\/$/, ''),
  fetch: async (request: Request) => {
    try { return await fetch(request) }
    catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error
      throw new ApiRequestError(0, 'Не удалось связаться с сервером. Проверьте подключение и повторите попытку.')
    }
  },
})
api.use({
  onRequest({ request }) {
    const launchParams = getLaunchParams()
    if (launchParams) request.headers.set('Authorization', 'VK ' + launchParams)
    return request
  },
  async onResponse({ response }) {
    if (!response.ok) throw await responseError(response)
    return response
  },
})
