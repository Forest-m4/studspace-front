import { authSync, getMe, patchMe, patchNotifications } from '@/shared/api/studspace'

export const userApi = {
  getMe,
  patchMe,
  patchNotifications,
  authSync,
}
