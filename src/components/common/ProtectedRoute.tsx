import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { hasStoredAuthToken } from '../../service/authTokens'
import useAppToast from './useAppToast'

type ProtectedRouteProps = {
  children: ReactNode
  message?: string
  redirectTo?: string
}

function ProtectedRoute({
  children,
  message = 'Please login for the access.',
  redirectTo = ROUTES.SIGN_IN,
}: ProtectedRouteProps) {
  const location = useLocation()
  const { showAppToast } = useAppToast()
  const hasAccess = hasStoredAuthToken()

  useEffect(() => {
    if (!hasAccess) {
      showAppToast(message, 'warning', { id: 'auth-required-warning' })
    }
  }, [hasAccess, message, showAppToast])

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

export default ProtectedRoute
