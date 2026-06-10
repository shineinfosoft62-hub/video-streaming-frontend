import { Box, Heading, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import AppBadge from '../components/common/AppBadge'
import VideoUploadForm from '../components/video/VideoUploadForm'

function VideoUpload() {
  const headingColor = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')

  return (
    <Box>
      <HStack justify="space-between" align={{ base: 'start', md: 'center' }} spacing={4} flexWrap="wrap">
        <Box>
            <AppBadge>
              Upload studio
            </AppBadge>
            <Heading as="h1" mt={4} fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1" color={headingColor}>
              Upload videos
            </Heading>
            <Text mt={3} maxW="640px" color={mutedColor} lineHeight="7">
              Add a source video, send it to the API, and review the generated DASH playback from the same dashboard.
            </Text>
        </Box>
      </HStack>

      <Box mt={{ base: 8, lg: 10 }} maxW="640px" mx="auto" w="100%">
        <VideoUploadForm />
      </Box>
    </Box>
  )
}

export default VideoUpload
