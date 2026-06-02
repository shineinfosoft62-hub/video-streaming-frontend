import axios from 'axios'
import { AUTH_LOGOUT, AUTH_SIGN_IN, AUTH_SIGN_UP } from '../config/api'
import { apiClient } from './api'
import { saveAuthTokens, saveAuthUser, type AuthTokens, type AuthUser } from './authTokens'

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
  user?: AuthUser
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

const getStringOrNumber = (record: Record<string, unknown> | null, key: string) => {
  const value = record?.[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
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
  const dataRecord = getRecord(record?.data)
  const tokensRecord = getRecord(record?.tokens)
  const dataTokensRecord = getRecord(dataRecord?.tokens)
  const accessToken =
    getString(tokensRecord, 'accessToken') ??
    getString(dataTokensRecord, 'accessToken') ??
    getString(dataRecord, 'accessToken') ??
    getString(record, 'accessToken')
  const refreshToken =
    getString(tokensRecord, 'refreshToken') ??
    getString(dataTokensRecord, 'refreshToken') ??
    getString(dataRecord, 'refreshToken') ??
    getString(record, 'refreshToken')

  if (!accessToken || !refreshToken) {
    throw new Error('Authentication response did not include tokens.')
  }

  return {
    message: getString(record, 'message'),
    tokens: {
      accessToken,
      refreshToken,
    },
    user: extractAuthUser(value),
  }
}

const extractAuthUser = (value: unknown): AuthUser | undefined => {
  const record = getRecord(value)
  const dataRecord = getRecord(record?.data)
  const userRecord =
    getRecord(record?.user) ??
    getRecord(record?.profile) ??
    getRecord(dataRecord?.user) ??
    getRecord(dataRecord?.profile) ??
    dataRecord ??
    record

  const user: AuthUser = {
    id: getStringOrNumber(userRecord, 'id') ?? getStringOrNumber(userRecord, '_id') ?? getStringOrNumber(userRecord, 'userId'),
    firstName: getString(userRecord, 'firstName') ?? getString(userRecord, 'firstname') ?? getString(userRecord, 'first_name'),
    lastName: getString(userRecord, 'lastName') ?? getString(userRecord, 'lastname') ?? getString(userRecord, 'last_name'),
    name: getString(userRecord, 'name') ?? getString(userRecord, 'fullName') ?? getString(userRecord, 'full_name'),
    email: getString(userRecord, 'email'),
    phone: getString(userRecord, 'phone') ?? getString(userRecord, 'phoneNumber') ?? getString(userRecord, 'mobile'),
    dob: getString(userRecord, 'dob') ?? getString(userRecord, 'birthdate') ?? getString(userRecord, 'dateOfBirth'),
  }

  return Object.values(user).some(Boolean) ? user : undefined
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
  if (authResponse.user) {
    saveAuthUser(authResponse.user)
  }

  return authResponse
}

export const logoutUser = async () => {
  const response = await apiClient.post<unknown>(AUTH_LOGOUT)

  return extractLogoutResponse(response.data)
}
