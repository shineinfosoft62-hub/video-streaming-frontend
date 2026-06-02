export const ROUTES = {
  home: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  dashboard: '/dashboard',
  DASHBOARD: '/dashboard/videos',
  DASHBOARD_UPLOAD: '/dashboard/upload',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PROFILE: '/dashboard/profile',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
