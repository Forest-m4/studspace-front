import {
  cancelAdminEvent,
  createAdminEvent,
  getEvents,
  registerEvent,
  subscribeWaitlist,
  unregisterEvent,
  unsubscribeWaitlist,
  updateAdminEvent,
} from '@/shared/api/studspace'

export const eventApi = {
  getEvents,
  registerEvent,
  unregisterEvent,
  subscribeWaitlist,
  unsubscribeWaitlist,
  createAdminEvent,
  updateAdminEvent,
  cancelAdminEvent,
}
