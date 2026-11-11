import createClient from 'openapi-fetch'
import { env } from '@/shared/config'
import { getLaunchParams } from './launchParams'
import type { components, paths } from './schema'

export type ApiError = components['schemas']['errors.ErrorBody']

export const api = createClient<paths>({ baseUrl: env.apiBaseUrl })

api.use({
  onRequest({ request }) {
    const launchParams = getLaunchParams()
    if (launchParams) request.headers.set('Authorization', `VK ${launchParams}`)
    return request
  },
})
