import createClient from 'openapi-fetch'
import { getLaunchParams } from './launchParams'
import type { components, paths } from './schema'

export type ApiError = components['schemas']['errors.ErrorBody']

export const api = createClient<paths>({ baseUrl: import.meta.env.VITE_API_BASE_URL })

api.use({
  onRequest({ request }) {
    const launchParams = getLaunchParams()
    if (launchParams) request.headers.set('Authorization', `VK ${launchParams}`)
    return request
  },
})
