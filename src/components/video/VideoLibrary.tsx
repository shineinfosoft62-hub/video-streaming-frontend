import { useCallback, useState } from 'react'
import { Box, HStack, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import DashChunkList from '../../components/common/DashChunkList'
import AppButton from '../../components/common/AppButton'
import VideoPlayer from './VideoPlayer'
import { type ShakaLoadedChunk } from './ShakaVideoPlayer'
import VideoQueueList from './VideoQueueList'
import { formatDate, formatFileSize } from '../../utils/videoFormatters'
import { getVideoPlaybackUrl, type VideoAsset } from '../../service/api'

type VideoLibraryProps = {
  videos: VideoAsset[]
  selectedVideo: VideoAsset | null
  isLoading: boolean
  searchQuery?: string
  onRefresh: () => void
  onSelectVideo: (video: VideoAsset) => void
}

function VideoLibrary({
  videos,
  selectedVideo,
  isLoading,
  searchQuery = '',
  onRefresh,
  onSelectVideo,
}: VideoLibraryProps) {
  const selectedVideoUrl = getVideoPlaybackUrl(selectedVideo)
  const [loadedChunkState, setLoadedChunkState] = useState<{ url: string; chunks: ShakaLoadedChunk[] }>({
    url: '',
    chunks: [],
  })
  const loadedChunks = loadedChunkState.url === selectedVideoUrl ? loadedChunkState.chunks : []
  const textColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')
  const cardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const headingColor = useColorModeValue('#172033', 'white')
  const metaColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600')
  const emptyBg = useColorModeValue('#f7faf9', '#111')
  const emptyColor = useColorModeValue('#172033', 'white')

  const handleChunkLoaded = useCallback((chunk: ShakaLoadedChunk) => {
    setLoadedChunkState((current) => {
      if (current.url !== selectedVideoUrl) {
        return { url: selectedVideoUrl, chunks: [chunk] }
      }

      if (current.chunks.some((item) => item.url === chunk.url)) {
        return current
      }

      return { url: selectedVideoUrl, chunks: [...current.chunks, chunk] }
    })
  }, [selectedVideoUrl])

  return (
    <Box mt={{ base: 10, lg: 14 }}>
      <HStack justify="space-between" align={{ base: 'start', sm: 'center' }} spacing={4}>
        <Box>
          <Text mt={2} color={textColor}>
            {searchQuery.trim()
              ? `Showing results for "${searchQuery.trim()}".`
              : 'Select a video from the API list and play the DASH manifest.'}
          </Text>
        </Box>
        <AppButton
          type="button"
          variant="outline"
          borderColor={cardBorder}
           bg="#e11d48"
           color="white"
          _hover={{ bg: '#be123c', textDecoration: 'none' }}
          isLoading={isLoading}
          onClick={onRefresh}
        >
          Refresh
        </AppButton>
      </HStack>

      <SimpleGrid
        mt={6}
        templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 420px' }}
        spacing={{ base: 6, lg: 6 }}
        alignItems="start"
      >
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={cardBorder}
          rounded="2xl"
          p={{ base: 4, md: 5 }}
          boxShadow="0 18px 50px rgba(23, 32, 51, 0.08)"
        >
            {selectedVideoUrl ? (
              <Stack spacing={4}>
                <VideoPlayer
                  key={selectedVideoUrl}
                  video={selectedVideo}
                  onChunkLoaded={handleChunkLoaded}
                />
                <DashChunkList manifestUrl={selectedVideoUrl} chunks={loadedChunks} hidden />
                <Box>
                  <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold" color={headingColor} noOfLines={2}>
                    {selectedVideo?.title}
                  </Text>
                  <Text mt={2} fontSize="sm" color={metaColor}>
                    {[formatFileSize(selectedVideo?.size), formatDate(selectedVideo?.createdAt)]
                      .filter(Boolean)
                      .join(' - ')}
                  </Text>
                  {selectedVideo?.description && (
                    <Text mt={3} color={textColor} lineHeight="7">
                      {selectedVideo.description}
                    </Text>
                  )}
                </Box>
              </Stack>
            ) : (
              <Box rounded="xl" bg={emptyBg} color={emptyColor} p={8} minH="360px" display="grid" placeItems="center">
                <Text fontWeight="semibold" textAlign="center">
                  Select a video with a DASH manifest to start playback.
                </Text>
              </Box>
            )}
        </Box>

        <VideoQueueList
          videos={videos}
          selectedVideo={selectedVideo}
          isLoading={isLoading}
          onSelectVideo={onSelectVideo}
        />
      </SimpleGrid>
    </Box>
  )
}

export default VideoLibrary
