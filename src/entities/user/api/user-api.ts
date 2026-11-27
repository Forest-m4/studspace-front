import { authSync, getMe, patchMe, patchNotifications } from '@/shared/api/studspace'
export { authSync, getMe }
export const userApi = { getMe, patchMe, patchNotifications, authSync }
