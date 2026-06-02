const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LEGACY_ACCESS_TOKEN_KEY = 'streamly_access_token'
const LEGACY_REFRESH_TOKEN_KEY = 'streamly_refresh_token'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
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

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY)
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY)
}

export const isAuthenticated = () => Boolean(getAccessToken())

export const hasStoredAuthToken = () => Boolean(getAccessToken() || getRefreshToken())
