import { useEffect, useMemo, useState } from 'react'
import { Box, Code, HStack, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import AppButton from './AppButton'
import AppSkeleton from './AppSkeleton'

type DashChunkListProps = {
  manifestUrl?: string
  chunks?: ChunkItem[]
  hidden?: boolean
}

type ChunkItem = {
  name: string
  url: string
}

const getChunkName = (url: string) => url.split('/').pop() ?? url

const isDashManifest = (url: string) => /\.mpd(\?|$)/i.test(url) || /manifest\.mpd(\?|$)/i.test(url)

const parseDashChunks = (manifestText: string, manifestUrl: string) => {
  const manifest = new DOMParser().parseFromString(manifestText, 'application/xml')
  const baseUrls = Array.from(manifest.querySelectorAll('BaseURL'))
    .map((node) => node.textContent?.trim())
    .filter(Boolean) as string[]
  const templates = Array.from(manifest.querySelectorAll('SegmentTemplate'))
  const urls = new Set<string>()

  baseUrls.forEach((baseUrl) => {
    urls.add(new URL(baseUrl, manifestUrl).toString())
  })

  templates.forEach((template) => {
    const initialization = template.getAttribute('initialization')
    const media = template.getAttribute('media')

    if (initialization) {
      urls.add(new URL(initialization.replace('$RepresentationID$', ''), manifestUrl).toString())
    }

    if (media) {
      urls.add(new URL(media.replace('$RepresentationID$', '').replace('$Number$', '1').replace('$Time$', '0'), manifestUrl).toString())
    }
  })

  return Array.from(urls).map((url) => ({
    name: getChunkName(url),
    url,
  }))
}

function DashChunkList({ manifestUrl, chunks: loadedChunks, hidden = false }: DashChunkListProps) {
  const [manifestChunks, setManifestChunks] = useState<ChunkItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const chunks = loadedChunks ?? manifestChunks
  const shouldShowLoadedChunks = Boolean(loadedChunks)
  const loadedChunkCount = loadedChunks?.length ?? 0
  const panelBg = useColorModeValue('#f7faf9', 'whiteAlpha.100')
  const panelBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const itemBg = useColorModeValue('white', 'whiteAlpha.100')
  const headingColor = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600')

  const canLoadManifest = useMemo(
    () => Boolean(!hidden && !loadedChunks && manifestUrl && (isDashManifest(manifestUrl) || manifestUrl.includes('/stream'))),
    [hidden, loadedChunks, manifestUrl],
  )

  useEffect(() => {
    if (!manifestUrl || !canLoadManifest) {
      return undefined
    }

    const controller = new AbortController()
    const loadChunks = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const response = await fetch(manifestUrl, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Could not load the DASH manifest.')
        }

        const manifestText = await response.text()
        setManifestChunks(parseDashChunks(manifestText, response.url || manifestUrl))
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setManifestChunks([])
        setErrorMessage(error instanceof Error ? error.message : 'Could not load chunks.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadChunks()

    return () => controller.abort()
  }, [canLoadManifest, loadedChunkCount, manifestUrl, refreshKey])

  if (!manifestUrl || hidden) {
    return null
  }

  return (
    <Box rounded="xl" bg={panelBg} border="1px solid" borderColor={panelBorder} p={4}>
      <HStack justify="space-between" align="start" spacing={4}>
        <Box minW={0}>
          <Text fontWeight="bold" color={headingColor}>
            DASH chunks
          </Text>
          <Text mt={1} fontSize="sm" color={mutedColor} noOfLines={1}>
            {manifestUrl}
          </Text>
        </Box>
        <AppButton
          type="button"
          size="sm"
          variant="outline"
          isLoading={isLoading}
          onClick={() => setRefreshKey((current) => current + 1)}
        >
          Refresh
        </AppButton>
      </HStack>

      {isLoading && !shouldShowLoadedChunks ? (
        <Stack mt={4} spacing={2}>
          <AppSkeleton h="26px" rounded="md" />
          <AppSkeleton h="26px" rounded="md" />
          <AppSkeleton h="26px" rounded="md" />
        </Stack>
      ) : errorMessage ? (
        <Text mt={4} fontSize="sm" color="red.500">
          {errorMessage}
        </Text>
      ) : chunks.length > 0 ? (
        <Stack mt={4} spacing={2} maxH="220px" overflowY="auto">
          {chunks.map((chunk, index) => (
            <Box key={`${chunk.url}-${index}`} rounded="md" bg={itemBg} p={3}>
              <Text fontSize="sm" fontWeight="bold" color={headingColor}>
                {index + 1}. {chunk.name}
              </Text>
              <Code mt={1} display="block" colorScheme="gray" whiteSpace="normal" wordBreak="break-all">
                {chunk.url}
              </Code>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text mt={4} fontSize="sm" color={mutedColor}>
          {shouldShowLoadedChunks ? 'Play the video to load chunks one by one.' : 'No media chunks were found in this manifest.'}
        </Text>
      )}
    </Box>
  )
}

export default DashChunkList
