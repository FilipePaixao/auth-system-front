export const ENDPOINTS = {
  auth: { login: '/authorizers/auth/login' },
  users: '/users',
  userById: (id: string) => `/users/${id}`,
  userByEmail: (email: string) => `/users/by-email?email=${encodeURIComponent(email)}`,
  userInactive: (id: string) => `/users/inactive/${id}`,
} as const
