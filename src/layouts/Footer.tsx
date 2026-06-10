import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

function Footer() {
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const textColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600')

  return (
    <Box as="footer" borderTop="1px solid" borderColor={borderColor} px={{ base: 4, md: 6 }} py={5}>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'flex-start', sm: 'center' }}
        justify="space-between"
        gap={2}
        color={textColor}
        fontSize="sm"
      >
        <Text>(c) 2026 Streamly dashboard</Text>
        <Text>DASH uploads, chunk review, and playback tools</Text>
      </Flex>
    </Box>
  )
}

export default Footer
