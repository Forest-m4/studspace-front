export interface User {
  id: string | number
  firstName: string
  lastName: string
  status?: string
  role?: 'student' | 'admin'
  notificationsAllowed?: boolean
}
