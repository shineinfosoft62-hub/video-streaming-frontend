import { Box, Heading, SimpleGrid, Switch, Text, VStack } from '@chakra-ui/react'
import AppBadge from '../components/common/AppBadge'
import { settings } from '../constants/dashboardSettings'

function DashboardSettings() {
  return (
    <Box>
      <AppBadge>
        Dashboard settings
      </AppBadge>
      <Heading as="h1" mt={4} fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1" color="white">
        Streaming controls
      </Heading>
      <Text mt={3} maxW="640px" color="whiteAlpha.700" lineHeight="7">
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
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.100"
            p={5}
          >
            <Box>
              <Heading as="h2" fontSize="xl" color="white">
                {setting.title}
              </Heading>
              <Text mt={3} color="whiteAlpha.700" lineHeight="7">
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
