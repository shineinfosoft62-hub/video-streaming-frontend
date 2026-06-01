import { useEffect, useMemo, useRef, useState } from 'react'
import { AspectRatio, Box, HStack, Icon, Stack, Text } from '@chakra-ui/react'
import shaka from 'shaka-player/dist/shaka-player.dash'
import { FaPlay, FaVolumeUp } from 'react-icons/fa'
import AppButton from '../common/AppButton'
import AppSkeleton from '../common/AppSkeleton'
import { getVideoId, getVideoPlaybackUrl, type VideoAsset } from '../../service/api'
import { formatDate, formatFileSize } from '../../utils/videoFormatters'

type VideoQueueListProps = {
  videos: VideoAsset[]
  selectedVideo: VideoAsset | null
  isLoading: boolean
  onSelectVideo: (video: VideoAsset) => void
}

const getVideoMetaText = (video: VideoAsset) =>
  [formatFileSize(video.size), formatDate(video.createdAt)].filter(Boolean).join(' - ')

const isDashManifest = (url: string) =>
  /\.mpd(\?|$)/i.test(url) || /manifest\.mpd(\?|$)/i.test(url) || url.includes('/manifest') || url.includes('/stream')

const getListPosterUrl = (video: VideoAsset) => video.thumbnailUrl ?? video.poster ?? video.thumbnailUrls?.[0] ?? ''

const getListPreviewUrl = (video: VideoAsset) => video.originalVideo ?? video.videoUrl ?? video.url ?? ''

function VideoThumbnail({
  playbackUrl,
  posterUrl,
  staticPreviewUrl,
  isPreviewActive,
  isSelected,
}: {
  playbackUrl?: string
  posterUrl?: string
  staticPreviewUrl?: string
  isPreviewActive: boolean
  isSelected: boolean
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const staticVideoRef = useRef<HTMLVideoElement | null>(null)
  const isPreviewActiveRef = useRef(isPreviewActive)
  const [failedPosterUrl, setFailedPosterUrl] = useState('')
  const safePosterUrl = posterUrl && failedPosterUrl !== posterUrl ? posterUrl : ''
  const shouldUseActivePreview = useMemo(
    () => Boolean(playbackUrl && isPreviewActive),
    [isPreviewActive, playbackUrl],
  )
  const shouldShowStaticVideo = Boolean(!safePosterUrl && staticPreviewUrl)
  const shouldShowPlaceholder = Boolean(!safePosterUrl && !staticPreviewUrl)

  useEffect(() => {
    const videoElement = staticVideoRef.current
    if (!videoElement || !shouldShowStaticVideo) {
      return undefined
    }

    const showFirstFrame = () => {
      if (videoElement.duration > 0 && videoElement.currentTime === 0) {
        videoElement.currentTime = Math.min(0.1, videoElement.duration)
      }
    }

    videoElement.addEventListener('loadedmetadata', showFirstFrame)
    videoElement.addEventListener('loadeddata', showFirstFrame)

    return () => {
      videoElement.removeEventListener('loadedmetadata', showFirstFrame)
      videoElement.removeEventListener('loadeddata', showFirstFrame)
    }
  }, [shouldShowStaticVideo, staticPreviewUrl])

  useEffect(() => {
    isPreviewActiveRef.current = isPreviewActive

    const videoElement = videoRef.current
    if (!videoElement) {
      return
    }

    if (isPreviewActive) {
      videoElement.muted = true
      void videoElement.play().catch(() => undefined)
    } else {
      videoElement.pause()
    }
  }, [isPreviewActive])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement || !shouldUseActivePreview || !playbackUrl) {
      return undefined
    }

    let isMounted = true
    let player: shaka.Player | null = null

    const playPreview = () => {
      if (isMounted && isPreviewActiveRef.current) {
        videoElement.muted = true
        void videoElement.play().catch(() => undefined)
      }
    }

    const pausePreview = () => {
      if (isMounted && !isPreviewActiveRef.current) {
        videoElement.pause()
      }
    }

    const restartPreview = () => {
      videoElement.currentTime = 0
      playPreview()
    }

    videoElement.addEventListener('loadeddata', pausePreview)
    videoElement.addEventListener('canplay', playPreview)
    videoElement.addEventListener('ended', restartPreview)

    if (isDashManifest(playbackUrl)) {
      shaka.polyfill.installAll()

      if (shaka.Player.isBrowserSupported()) {
        player = new shaka.Player(videoElement)
        player.configure({
          abr: {
            enabled: true,
          },
          streaming: {
            bufferingGoal: 1,
            rebufferingGoal: 0.5,
            bufferBehind: 0,
            segmentPrefetchLimit: 0,
            preloadNextUrlWindow: 0,
            disableAudioPrefetch: true,
            disableVideoPrefetch: true,
            disableTextPrefetch: true,
            stopFetchingOnPause: true,
          },
        })

        void player.load(playbackUrl).then(playPreview).catch(() => undefined)
      }
    } else {
      videoElement.src = playbackUrl
      videoElement.load()
    }

    return () => {
      isMounted = false
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
      void player?.destroy()
      videoElement.removeEventListener('loadeddata', pausePreview)
      videoElement.removeEventListener('canplay', playPreview)
      videoElement.removeEventListener('ended', restartPreview)
    }
  }, [playbackUrl, shouldUseActivePreview])

  return (
    <Box
      w="100%"
      h="100%"
      rounded="md"
      bg="transparent"
      position="relative"
      overflow="hidden"
    >
      {safePosterUrl && (
        <Box
          as="img"
          src={safePosterUrl}
          alt=""
          onError={() => setFailedPosterUrl(safePosterUrl)}
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      )}
      {shouldShowStaticVideo && (
        <video
          ref={staticVideoRef}
          src={staticPreviewUrl}
          muted
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
          }}
        />
      )}
      {shouldShowPlaceholder && (
        <Box
          position="absolute"
          inset={0}
          display="grid"
          placeItems="center"
          bg="linear-gradient(135deg, #334155, #0f766e 52%, #e11d48)"
          color="white"
          fontWeight="bold"
          fontSize="xs"
          textAlign="center"
          px={3}
        >
          Preview
        </Box>
      )}
      {shouldShowStaticVideo && !shouldUseActivePreview && (
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.24))"
        />
      )}
      {shouldUseActivePreview && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />
      )}
      <Box position="absolute" inset="0" zIndex={2} bg="linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.26))" />
      <Box
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        zIndex={3}
        w="40px"
        h="40px"
        rounded="full"
        bg="blackAlpha.500"
        display="grid"
        placeItems="center"
        color="white"
      >
        <Icon as={FaPlay} boxSize={4} ml={0.5} />
      </Box>
      {isSelected && (
        <Box
          position="absolute"
          left={2}
          bottom={2}
          zIndex={3}
          w="30px"
          h="30px"
          rounded="full"
          bg="#14b8a6"
          color="#041311"
          display="grid"
          placeItems="center"
          boxShadow="0 8px 18px rgba(20, 184, 166, 0.35)"
          aria-label="Currently playing"
        >
          <Icon as={FaVolumeUp} boxSize={3.5} />
        </Box>
      )}
    </Box>
  )
}

function VideoQueueList({ videos, selectedVideo, isLoading, onSelectVideo }: VideoQueueListProps) {
  const [activePreviewId, setActivePreviewId] = useState('')

  return (
    <Box bg="transparent" p={0}>
      <HStack px={1} mb={3} justify="space-between" align="center">
        <Text fontWeight="bold" color="white">
          Up next
        </Text>
        <Text fontSize="sm" color="whiteAlpha.600">
          {videos.length} videos
        </Text>
      </HStack>

      {isLoading ? (
        <Stack spacing={3}>
          <AppSkeleton h="86px" rounded="xl" />
          <AppSkeleton h="86px" rounded="xl" />
          <AppSkeleton h="86px" rounded="xl" />
        </Stack>
      ) : videos.length > 0 ? (
        <Stack spacing={2}>
          {videos.map((video) => {
            const videoId = getVideoId(video)
            const isSelected = getVideoId(selectedVideo ?? video) === videoId
            const metaText = getVideoMetaText(video)
            const playbackUrl = getVideoPlaybackUrl(video)
            const posterUrl = getListPosterUrl(video)
            const staticPreviewUrl = getListPreviewUrl(video)
            const isPreviewActive = activePreviewId === videoId

            return (
              <AppButton
                key={videoId}
                type="button"
                h="auto"
                justifyContent="flex-start"
                textAlign="left"
                whiteSpace="normal"
                bg={isSelected ? 'whiteAlpha.100' : 'transparent'}
                color="white"
                p={0}
                rounded="md"
                w="100%"
                border="1px solid"
                borderColor={isSelected ? 'whiteAlpha.200' : 'transparent'}
                _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.200' }}
                onBlur={() => setActivePreviewId('')}
                onClick={() => onSelectVideo(video)}
                onFocus={() => setActivePreviewId(videoId)}
                onMouseEnter={() => setActivePreviewId(videoId)}
                onMouseLeave={() => setActivePreviewId((current) => (current === videoId ? '' : current))}
              >
                <HStack align="start" spacing={3} w="100%" p={1}>
                  <AspectRatio ratio={16 / 9} w={{ base: '132px', md: '188px' }} flexShrink={0}>
                    <Box position="relative">
                      <VideoThumbnail
                        playbackUrl={playbackUrl}
                        posterUrl={posterUrl}
                        staticPreviewUrl={staticPreviewUrl}
                        isPreviewActive={isPreviewActive}
                        isSelected={isSelected}
                      />
                    </Box>
                  </AspectRatio>
                  <Box minW={0} flex="1" pt={0.5} pr={1}>
                    <Text fontWeight="bold" noOfLines={2} lineHeight="5" color="white" fontSize="sm">
                      {video.title}
                    </Text>
                    {metaText && (
                      <Text mt={1} fontSize="xs" color="whiteAlpha.600" noOfLines={2} lineHeight="5" fontWeight="semibold">
                        {metaText}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </AppButton>
            )
          })}
        </Stack>
      ) : (
        <Box rounded="xl" bg="#f7faf9" p={6} textAlign="center">
          <Text fontWeight="bold" color="#172033">
            No videos found
          </Text>
          <Text mt={2} fontSize="sm" color="blackAlpha.600">
            Upload a video or check that your API returns videos correctly.
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default VideoQueueList
