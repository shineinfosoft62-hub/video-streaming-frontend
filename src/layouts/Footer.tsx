import { Box, Flex, Text } from '@chakra-ui/react'

function Footer() {
  return (
    <Box as="footer" borderTop="1px solid" borderColor="whiteAlpha.100" px={{ base: 4, md: 6 }} py={5}>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'flex-start', sm: 'center' }}
        justify="space-between"
        gap={2}
        color="whiteAlpha.600"
        fontSize="sm"
      >
        <Text>(c) 2026 Streamly dashboard</Text>
        <Text>DASH uploads, chunk review, and playback tools</Text>
      </Flex>
    </Box>
  )
}

export default Footer
