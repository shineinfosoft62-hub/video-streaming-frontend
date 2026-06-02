export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const AUTH_SIGN_UP = '/auth/user/signup'
export const AUTH_SIGN_IN = '/auth/user/signin'
export const VIDEO_UPLOAD = '/videos'
export const VIDEO_LIST = '/videos'
export const GET_VIDEO_BY_ID = '/videos/:id'
export const VIDEO_STREAM = '/videos/:id/manifest'
