export class ApiRequestError extends Error {
  status: number
  code: string
  fields: Record<string, string>
  constructor(status: number, message: string, code = '', fields: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Не удалось выполнить действие. Попробуйте ещё раз.'
}
export async function responseError(response: Response) {
  const body = await response.clone().json().catch(() => null)
  const value = body?.error
  const fields: Record<string, string> = {}
  for (const [key, message] of Object.entries(value?.details?.fields ?? {})) {
    if (typeof message === 'string') fields[key] = message
  }
  const fallback = response.status === 401 ? 'Срок входа истёк. Закройте и снова откройте приложение из VK.'
    : response.status === 403 ? 'Недостаточно прав для этого действия.'
    : response.status >= 500 ? 'Сервер временно недоступен. Попробуйте ещё раз.'
    : 'Не удалось выполнить действие. Попробуйте ещё раз.'
  return new ApiRequestError(response.status, typeof value?.message === 'string' ? value.message : fallback, value?.code, fields)
}
