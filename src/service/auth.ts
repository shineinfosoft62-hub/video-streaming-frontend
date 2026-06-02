import axios from 'axios'
import { AUTH_LOGOUT, AUTH_SIGN_IN, AUTH_SIGN_UP } from '../config/api'
import { apiClient } from './api'
import { saveAuthTokens, type AuthTokens } from './authTokens'

export type SignUpPayload = {
  firstName: string
  lastName: string
  dob: string
  email: string
  phone: string
  password: string
}

export type SignInPayload = {
  email: string
  password: string
}

type AuthResponse = {
  message?: string
  tokens: AuthTokens
}

type SignUpResponse = {
  message?: string
}

type LogoutResponse = {
  message?: string
}

const getRecord = (value: unknown) => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

const getString = (record: Record<string, unknown> | null, key: string) => {
  const value = record?.[key]
  return typeof value === 'string' ? value : undefined
}

const toFormData = (payload: Record<string, string>) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return formData
}

const extractAuthResponse = (value: unknown): AuthResponse => {
  const record = getRecord(value)
  const tokensRecord = getRecord(record?.tokens)
  const accessToken = getString(tokensRecord, 'accessToken') ?? getString(record, 'accessToken')
  const refreshToken = getString(tokensRecord, 'refreshToken') ?? getString(record, 'refreshToken')

  if (!accessToken || !refreshToken) {
    throw new Error('Authentication response did not include tokens.')
  }

  return {
    message: getString(record, 'message'),
    tokens: {
      accessToken,
      refreshToken,
    },
  }
}

const extractSignUpResponse = (value: unknown): SignUpResponse => {
  const record = getRecord(value)

  return {
    message: getString(record, 'message'),
  }
}

const extractLogoutResponse = (value: unknown): LogoutResponse => {
  const record = getRecord(value)

  return {
    message: getString(record, 'message'),
  }
}

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const record = getRecord(error.response?.data)
    const message = getString(record, 'message') ?? getString(record, 'error')

    return message ?? error.message
  }

  return error instanceof Error ? error.message : 'Request failed.'
}

export const signUpUser = async (payload: SignUpPayload) => {
  const response = await apiClient.post<unknown>(AUTH_SIGN_UP, toFormData(payload))

  return extractSignUpResponse(response.data)
}

export const signInUser = async (payload: SignInPayload) => {
  const response = await apiClient.post<unknown>(AUTH_SIGN_IN, toFormData(payload))
  const authResponse = extractAuthResponse(response.data)

  saveAuthTokens(authResponse.tokens)

  return authResponse
}

export const logoutUser = async () => {
  const response = await apiClient.post<unknown>(AUTH_LOGOUT)

  return extractLogoutResponse(response.data)
}
