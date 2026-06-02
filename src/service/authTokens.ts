const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const AUTH_USER_KEY = 'authUser'
const LEGACY_ACCESS_TOKEN_KEY = 'streamly_access_token'
const LEGACY_REFRESH_TOKEN_KEY = 'streamly_refresh_token'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type AuthUser = {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phone?: string
  dob?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) ?? localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) ?? localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY)

export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export const saveAuthTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  saveAccessToken(accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const saveAuthUser = (user: AuthUser) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const getAuthUser = (): AuthUser | null => {
  const value = localStorage.getItem(AUTH_USER_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY)
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY)
}

export const isAuthenticated = () => Boolean(getAccessToken())

export const hasStoredAuthToken = () => Boolean(getAccessToken() || getRefreshToken())

export const getAuthUserDisplayName = (user = getAuthUser()) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()

  return fullName || user?.name || user?.email || 'User'
}
