import { Box, Heading, SimpleGrid, Switch, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import AppBadge from '../components/common/AppBadge'
import { settings } from '../constants/dashboardSettings'

function DashboardSettings() {
  const headingColor = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')
  const cardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

  return (
    <Box>
      <AppBadge>
        Dashboard settings
      </AppBadge>
      <Heading as="h1" mt={4} fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1" color={headingColor}>
        Streaming controls
      </Heading>
      <Text mt={3} maxW="640px" color={mutedColor} lineHeight="7">
        Tune the dashboard defaults for publishing, chunk inspection, and team updates.
      </Text>

      <SimpleGrid mt={8} columns={{ base: 1, md: 3 }} spacing={4}>
        {settings.map((setting) => (
          <VStack
            key={setting.title}
            align="stretch"
            justify="space-between"
            minH="190px"
            rounded="2xl"
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
            p={5}
          >
            <Box>
              <Heading as="h2" fontSize="xl" color={headingColor}>
                {setting.title}
              </Heading>
              <Text mt={3} color={mutedColor} lineHeight="7">
                {setting.description}
              </Text>
            </Box>
            <Switch colorScheme="pink" alignSelf="flex-start" />
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default DashboardSettings
