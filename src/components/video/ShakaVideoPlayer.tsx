import { useEffect, useMemo, useRef, useState } from 'react'
import { AspectRatio, Box, Spinner, Text, type BoxProps } from '@chakra-ui/react'
import shaka from 'shaka-player/dist/shaka-player.ui'
import 'shaka-player/dist/controls.css'
import {SHAKA_UI_CONFIG, SHAKA_PLAYER_CONFIG} from '../../constants/videoConstants'

export type ShakaLoadedChunk = {
  name: string
  url: string
}

type ShakaVideoAsset = {
  title?: string
  poster?: string
  thumbnailUrl?: string
  dashUrl?: string
  manifestUrl?: string
  mpdUrl?: string
  streamUrl?: string
  playbackUrl?: string
  videoUrl?: string
  url?: string
}

type ShakaVideoPlayerProps = {
  video?: ShakaVideoAsset | null
  src?: string | null
  title?: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  onChunkLoaded?: (chunk: ShakaLoadedChunk) => void
} & Omit<BoxProps, 'title'>

const getChunkName = (url: string) => url.split('/').pop() ?? url

const getVideoSource = (video?: ShakaVideoAsset | null) =>
  video?.dashUrl ??
  video?.manifestUrl ??
  video?.mpdUrl ??
  video?.streamUrl ??
  video?.playbackUrl ??
  video?.videoUrl ??
  video?.url ??
  ''

const isSegmentUrl = (url: string) =>
  /\.(m4s|mp4|webm|cmfv|cmfa)(\?|$)/i.test(url) ||
  /(?:chunk|segment|fragment|init)[-_./]?[^/]*(?:\?|$)/i.test(url)

const isDashManifest = (url: string) =>
  /\.mpd(\?|$)/i.test(url) || /manifest\.mpd(\?|$)/i.test(url) || url.includes('/manifest')

function ShakaVideoPlayer({
  video,
  src,
  title = 'Video player',
  poster,
  autoPlay = false,
  muted = false,
  controls = true,
  onChunkLoaded,
  ...boxProps
}: ShakaVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const loadedChunkUrlsRef = useRef(new Set<string>())
  const videoSource = src ?? getVideoSource(video)
  const videoTitle = title === 'Video player' ? video?.title ?? title : title
  const videoPoster = poster ?? video?.poster ?? video?.thumbnailUrl
  const [isLoading, setIsLoading] = useState(Boolean(videoSource))
  const [errorMessage, setErrorMessage] = useState('')

  const isDashSource = useMemo(() => {
    if (!videoSource) {
      return false
    }

    return videoSource.startsWith('blob:') === false && (isDashManifest(videoSource) || videoSource.includes('/stream'))
  }, [videoSource])

  useEffect(() => {
    const containerElement = containerRef.current
    const videoElement = videoRef.current
    if (!containerElement || !videoElement) {
      return undefined
    }

    loadedChunkUrlsRef.current.clear()
    setErrorMessage('')
    setIsLoading(Boolean(videoSource))
    videoElement.removeAttribute('src')
    videoElement.load()

    if (!videoSource) {
      return undefined
    }

    const handleReady = () => setIsLoading(false)
    const handleWaiting = () => setIsLoading(true)
    const handleVideoError = () => {
      setIsLoading(false)
      setErrorMessage('This video could not be loaded.')
    }

    const handleChunkLoaded = (url?: string) => {
      if (!url || loadedChunkUrlsRef.current.has(url) || !isSegmentUrl(url)) {
        return
      }

      loadedChunkUrlsRef.current.add(url)
      onChunkLoaded?.({
        name: getChunkName(url),
        url,
      })
    }

    videoElement.addEventListener('canplay', handleReady)
    videoElement.addEventListener('loadeddata', handleReady)
    videoElement.addEventListener('loadedmetadata', handleReady)
    videoElement.addEventListener('playing', handleReady)
    videoElement.addEventListener('timeupdate', handleReady)
    videoElement.addEventListener('waiting', handleWaiting)
    videoElement.addEventListener('error', handleVideoError)

    shaka.polyfill.installAll()

    if (!shaka.Player.isBrowserSupported()) {
      queueMicrotask(() => {
        setIsLoading(false)
        setErrorMessage('DASH playback is not supported in this browser.')
      })
      return () => {
        videoElement.removeEventListener('canplay', handleReady)
        videoElement.removeEventListener('loadeddata', handleReady)
        videoElement.removeEventListener('loadedmetadata', handleReady)
        videoElement.removeEventListener('playing', handleReady)
        videoElement.removeEventListener('timeupdate', handleReady)
        videoElement.removeEventListener('waiting', handleWaiting)
        videoElement.removeEventListener('error', handleVideoError)
      }
    }

    const player = new shaka.Player(videoElement)
    const ui = controls ? new shaka.ui.Overlay(player, containerElement, videoElement) : null

    ui?.configure(SHAKA_UI_CONFIG)

    player.configure(SHAKA_PLAYER_CONFIG)

    const networkingEngine = player.getNetworkingEngine()
    networkingEngine?.registerRequestFilter((type, request) => {
      if (type === shaka.net.NetworkingEngine.RequestType.SEGMENT) {
        request.uris.forEach(handleChunkLoaded)
      }
    })
    networkingEngine?.registerResponseFilter((type, response) => {
      if (type === shaka.net.NetworkingEngine.RequestType.SEGMENT) {
        handleChunkLoaded(response.uri)
      }
    })

    const handleShakaError = () => {
      setIsLoading(false)
      setErrorMessage('This DASH stream could not be loaded.')
    }

    let isMounted = true
    player.addEventListener('error', handleShakaError)

    const loadVideo = async () => {
      try {
        if (isDashSource) {
          await player.load(videoSource)
        } else {
          videoElement.src = videoSource
          videoElement.load()
        }

        if (!isMounted) {
          return
        }

        setIsLoading(false)     
        if (autoPlay) {
          void videoElement.play()
        }
      } catch {
        if (isMounted) {
          handleShakaError()
        }
      }
    }

    void loadVideo()

    return () => {
      isMounted = false
      player.removeEventListener('error', handleShakaError)
      void ui?.destroy()
      void player.unload().finally(() => player.destroy())
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
      videoElement.removeEventListener('canplay', handleReady)
      videoElement.removeEventListener('loadeddata', handleReady)
      videoElement.removeEventListener('loadedmetadata', handleReady)
      videoElement.removeEventListener('playing', handleReady)
      videoElement.removeEventListener('timeupdate', handleReady)
      videoElement.removeEventListener('waiting', handleWaiting)
      videoElement.removeEventListener('error', handleVideoError)
    }
  }, [autoPlay, controls, isDashSource, onChunkLoaded, videoSource])

  return (
    <Box
      overflow="hidden"
      rounded="lg"
      bg="#111"
      border="1px solid"
      borderColor="blackAlpha.200"
      position="relative"
      {...boxProps}
    >
      <AspectRatio ratio={16 / 9}>
        <Box
          ref={containerRef}
          data-shaka-player-container
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <video
            ref={videoRef}
            data-shaka-player
            title={videoTitle}
            poster={videoPoster}
            autoPlay={autoPlay}
            muted={muted}
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: '#000',
            }}
          />
        </Box>
      </AspectRatio>

      {isLoading && (
        <Box position="absolute" inset="0" display="grid" placeItems="center" bg="blackAlpha.500" pointerEvents="none">
          <Spinner color="white" thickness="3px" />
        </Box>
      )}

      {errorMessage && (
        <Box position="absolute" inset="0" display="grid" placeItems="center" bg="blackAlpha.700" p={4}>
          <Text color="white" fontWeight="semibold" textAlign="center">
            {errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default ShakaVideoPlayer
