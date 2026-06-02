import axios, { type AxiosProgressEvent } from 'axios'
import { API_BASE_URL, GET_VIDEO_BY_ID, VIDEO_LIST, VIDEO_STREAM, VIDEO_UPLOAD } from '../config/api'
import { getAccessToken, saveAccessToken } from './authTokens'

export type VideoAsset = {
  id?: string
  _id?: string
  title: string
  description?: string
  url?: string
  manifestUrl?: string
  mpdUrl?: string
  dashUrl?: string
  videoUrl?: string
  streamUrl?: string
  originalVideo?: string
  playbackUrl?: string
  thumbnailUrl?: string
  thumbnailUrls?: string[]
  poster?: string
  size?: number
  createdAt?: string
  responseMessage?: string
}

type UploadVideoPayload = {
  title: string
  description: string
  video: File
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL
})

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use((response) => {
  const nextAccessToken = response.headers['x-access-token']

  if (typeof nextAccessToken === 'string' && nextAccessToken) {
    saveAccessToken(nextAccessToken)
  }

  return response
})

const getResponseRecord = (value: unknown) => {
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

const getNumber = (record: Record<string, unknown> | null, key: string) => {
  const value = record?.[key]
  return typeof value === 'number' ? value : undefined
}

const resolveApiUrl = (url?: string) => {
  if (!url || url.startsWith('http') || url.startsWith('blob:')) {
    return url
  }

  const normalizedUrl = url.replaceAll('\\', '/')
  return `${API_BASE_URL}${normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`}`
}

const resolveVideoStreamUrl = (id?: string) => {
  if (!id) {
    return undefined
  }

  return resolveApiUrl(VIDEO_STREAM.replace(':id', encodeURIComponent(id)))
}

const getUniqueStrings = (values: Array<string | undefined>) => Array.from(new Set(values.filter(Boolean) as string[]))

const normalizeVideo = (value: unknown): VideoAsset => {
  const record = getResponseRecord(value)
  const id = getStringOrNumber(record, 'id') ?? getStringOrNumber(record, '_id') ?? getStringOrNumber(record, 'videoId')
  const title = getString(record, 'title') ?? getString(record, 'filename') ?? 'Untitled video'
  const dashUrl = resolveApiUrl(getString(record, 'dashUrl'))
  const manifestUrl =
    dashUrl ??
    resolveApiUrl(getString(record, 'manifestUrl')) ??
    resolveApiUrl(getString(record, 'mpdUrl')) ??
    resolveApiUrl(getString(record, 'streamUrl'))
  const streamUrl =
    manifestUrl ??
    resolveApiUrl(getString(record, 'playbackUrl')) ??
    resolveVideoStreamUrl(id)
  const thumbnailUrls = getUniqueStrings([
    resolveApiUrl(getString(record, 'thumbnailUrl')),
    resolveApiUrl(getString(record, 'thumbnail')),
    resolveApiUrl(getString(record, 'thumbnail_url')),
    resolveApiUrl(getString(record, 'thumbUrl')),
    resolveApiUrl(getString(record, 'thumb_url')),
    resolveApiUrl(getString(record, 'thumbnailPath')),
    resolveApiUrl(getString(record, 'poster')),
    resolveApiUrl(getString(record, 'posterUrl')),
    resolveApiUrl(getString(record, 'poster_url')),
    resolveApiUrl(getString(record, 'imageUrl')),
    resolveApiUrl(getString(record, 'image_url')),
    resolveApiUrl(getString(record, 'coverUrl')),
    resolveApiUrl(getString(record, 'cover_url')),
  ])
  const thumbnailUrl = thumbnailUrls[0]

  return {
    id,
    _id: getString(record, '_id'),
    title,
    description: getString(record, 'description'),
    url: resolveApiUrl(getString(record, 'url') ?? getString(record, 'path') ?? getString(record, 'originalVideo')),
    manifestUrl,
    mpdUrl: resolveApiUrl(getString(record, 'mpdUrl')),
    dashUrl: dashUrl ?? manifestUrl,
    videoUrl: resolveApiUrl(getString(record, 'videoUrl')),
    streamUrl,
    originalVideo: resolveApiUrl(getString(record, 'originalVideo')),
    playbackUrl: resolveApiUrl(getString(record, 'playbackUrl')) ?? streamUrl,
    thumbnailUrl,
    thumbnailUrls,
    poster: thumbnailUrl,
    size: getNumber(record, 'size') ?? getNumber(record, 'length'),
    createdAt: getString(record, 'createdAt'),
  }
}

const extractVideo = (value: unknown) => {
  const record = getResponseRecord(value)
  const video = normalizeVideo(record?.video ?? record?.data ?? value)
  return {
    ...video,
    responseMessage: getString(record, 'message'),
  }
}

const extractVideos = (value: unknown) => {
  const record = getResponseRecord(value)
  const videos = Array.isArray(value)
    ? value
    : Array.isArray(record?.videos)
      ? record.videos
      : Array.isArray(record?.data)
        ? record.data
        : []

  return videos.map(normalizeVideo)
}

export const getVideoId = (video: VideoAsset) =>
  video.id ?? video._id ?? video.dashUrl ?? video.manifestUrl ?? video.playbackUrl ?? video.url ?? video.title

export const getVideoPlaybackUrl = (video?: VideoAsset | null) =>
  video?.dashUrl ??
  video?.manifestUrl ??
  video?.mpdUrl ??
  video?.streamUrl ??
  video?.playbackUrl ??
  video?.videoUrl ??
  video?.url ??
  ''

export const uploadVideo = async (
  payload: UploadVideoPayload,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('video', payload.video)

  const response = await apiClient.post<unknown>(VIDEO_UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })

  return extractVideo(response.data)
}

export const getVideos = async () => {
  const response = await apiClient.get<unknown>(VIDEO_LIST)
  return extractVideos(response.data)
}

export const getVideoById = async (id: string) => {
  const response = await apiClient.get<unknown>(GET_VIDEO_BY_ID.replace(':id', id))
  return extractVideo(response.data)
}
