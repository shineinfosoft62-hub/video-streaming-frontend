import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Heading, HStack, Text, useToast } from '@chakra-ui/react'
import { useSearchParams } from 'react-router-dom'
import AppBadge from '../components/common/AppBadge'
import { AppToast } from '../components/common/appToast'
import VideoLibrary from '../components/video/VideoLibrary'
import { getVideoId, getVideos, type VideoAsset } from '../service/api'

function VideoList() {
  const [videos, setVideos] = useState<VideoAsset[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null)
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)
  const hasLoadedVideosRef = useRef(false)
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const filteredVideos = useMemo(() => {
    if (!searchQuery) {
      return videos
    }

    return videos.filter((video) =>
      [video.title, video.description, video.createdAt]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(searchQuery)),
    )
  }, [searchQuery, videos])

  const loadVideos = useCallback(async () => {
    try {
      setIsLoadingVideos(true)
      const nextVideos = await getVideos()

      setVideos(nextVideos)
      setSelectedVideo((current) => current ?? nextVideos[0] ?? null)
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Please check the video list API.'

      AppToast(toast, {
        title: 'Could not load videos',
        description,
        status: 'error',
        duration: 4500,
      })
    } finally {
      setIsLoadingVideos(false)
    }
  }, [toast])

  useEffect(() => {
    if (hasLoadedVideosRef.current) {
      return
    }

    hasLoadedVideosRef.current = true
    queueMicrotask(() => void loadVideos())
  }, [loadVideos])

  useEffect(() => {
    if (filteredVideos.length === 0) {
      setSelectedVideo(null)
      return
    }

    setSelectedVideo((current) => {
      if (current && filteredVideos.some((video) => getVideoId(video) === getVideoId(current))) {
        return current
      }

      return filteredVideos[0]
    })
  }, [filteredVideos])

  return (
    <Box>
      <HStack justify="space-between" align={{ base: 'start', md: 'center' }} spacing={4} flexWrap="wrap">
        <Box>
          <AppBadge>
            Start watching
          </AppBadge>
          <Heading as="h1" mt={4} fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1" color="white">
            Video list
          </Heading>
          <Text mt={3} maxW="640px" color="whiteAlpha.700" lineHeight="7">
            Browse uploaded videos, preview DASH playback, and inspect the generated media chunks from one responsive dashboard view.
          </Text>
        </Box>
      </HStack>
      <VideoLibrary
        videos={filteredVideos}
        selectedVideo={selectedVideo}
        isLoading={isLoadingVideos}
        searchQuery={searchParams.get('q') ?? ''}
        onRefresh={() => void loadVideos()}
        onSelectVideo={setSelectedVideo}
      />
    </Box>
  )
}

export default VideoList
