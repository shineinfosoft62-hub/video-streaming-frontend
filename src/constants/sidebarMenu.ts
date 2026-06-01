import { ROUTES } from './routes'

export const sidebarMenuItems = [
  {
    label: 'Video List',
    path: ROUTES.DASHBOARD,
    icon: 'videos',
  },
  {
    label: 'Upload Video',
    path: ROUTES.DASHBOARD_UPLOAD,
    icon: 'upload',
  },
  {
    label: 'Settings',
    path: ROUTES.DASHBOARD_SETTINGS,
    icon: 'settings',
  },
] as const
