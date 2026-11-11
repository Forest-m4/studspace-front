import {
  approveAdminBooking,
  cancelAdminBooking,
  cancelBooking,
  createBooking,
  getAdminBookings,
  getMyBookings,
  rejectAdminBooking,
  rescheduleBooking,
  returnAdminBookingToReview,
  withdrawBooking,
} from '@/shared/api/studspace'

export const bookingApi = {
  createBooking,
  getMyBookings,
  withdrawBooking,
  rescheduleBooking,
  cancelBooking,
  getAdminBookings,
  approveAdminBooking,
  rejectAdminBooking,
  cancelAdminBooking,
  returnAdminBookingToReview,
}
