import {
  Box,
  Divider,
  Flex,
  HStack,
  Stack,
  Text,
  type BoxProps,
} from '@chakra-ui/react'
import { AddIcon, SettingsIcon, ViewIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import AppButton from '../components/common/AppButton'
import { sidebarMenuItems } from '../constants/sidebarMenu'
import { ROUTES } from '../constants/routes'

type SidebarProps = BoxProps & {
  onNavigate?: () => void
}

const iconMap = {
  videos: ViewIcon,
  upload: AddIcon,
  settings: SettingsIcon,
}

function Sidebar({ onNavigate, ...props }: SidebarProps) {
  const location = useLocation()

  return (
    <Box
      as="aside"
      w={{ base: 'full', lg: '280px' }}
      bg="#090b10"
      color="white"
      borderRight="1px solid"
      borderColor="whiteAlpha.100"
      px={4}
      py={5}
      {...props}
    >
      <Flex h="full" direction="column">
        <AppButton
          as={RouterLink}
          to={ROUTES.home}
          variant="ghost"
          justifyContent="flex-start"
          h="54px"
          px={3}
          color="white"
          _hover={{ bg: 'whiteAlpha.100', textDecoration: 'none' }}
          onClick={onNavigate}
        >
          <Box textAlign="left">
            <Text fontSize="lg" fontWeight="black" lineHeight="1">
              Streamly
            </Text>
            <Text mt={1} fontSize="xs" color="whiteAlpha.500">
              Creator dashboard
            </Text>
          </Box>
        </AppButton>

        <Divider my={5} borderColor="whiteAlpha.100" />

        <Stack spacing={2}>
          {sidebarMenuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = iconMap[item.icon]

            return (
              <AppButton
                key={item.path}
                as={RouterLink}
                to={item.path}
                leftIcon={<Icon />}
                justifyContent="flex-start"
                h="48px"
                rounded="xl"
                bg={isActive ? '#e11d48' : 'transparent'}
                color={isActive ? 'white' : 'whiteAlpha.800'}
                _hover={{ bg: isActive ? '#e11d48' : 'whiteAlpha.100', color: 'white' }}
                onClick={onNavigate}
              >
                {item.label}
              </AppButton>
            )
          })}
        </Stack>

        <Box mt="auto" rounded="2xl" bg="whiteAlpha.100" p={4}>
          <HStack spacing={3}>
            <Box boxSize="10px" rounded="full" bg="#14b8a6" />
            <Box>
              <Text fontWeight="bold">DASH Ready</Text>
              <Text mt={1} fontSize="sm" color="whiteAlpha.600">
                Uploads are prepared for chunk playback.
              </Text>
            </Box>
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}

export default Sidebar
