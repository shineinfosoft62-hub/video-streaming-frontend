import {
  Box,
  Divider,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  type BoxProps,
} from '@chakra-ui/react'
import { AddIcon, SettingsIcon, ViewIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import AppButton from '../components/common/AppButton'
import AppLogoutButton from '../components/common/AppLogoutButton'
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
  const bg = useColorModeValue('white', '#090b10')
  const color = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.500')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const inactiveColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.800')
  const inactiveHoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')
  const inactiveHoverColor = useColorModeValue('#172033', 'white')

  return (
    <Box
      as="aside"
      w={{ base: 'full', lg: '280px' }}
      bg={bg}
      color={color}
      borderRight="1px solid"
      borderColor={borderColor}
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
          color={color}
          _hover={{ bg: inactiveHoverBg, textDecoration: 'none' }}
          onClick={onNavigate}
        >
          <Box textAlign="left">
            <Text fontSize="lg" fontWeight="black" lineHeight="1">
              Streamly
            </Text>
            <Text mt={1} fontSize="xs" color={mutedColor}>
              Creator dashboard
            </Text>
          </Box>
        </AppButton>

        <Divider my={5} borderColor={borderColor} />

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
                color={isActive ? 'white' : inactiveColor}
                _hover={{ bg: isActive ? '#e11d48' : inactiveHoverBg, color: inactiveHoverColor }}
                onClick={onNavigate}
              >
                {item.label}
              </AppButton>
            )
          })}
        </Stack>

        <AppLogoutButton mt="auto" mode="sidebar" onLoggedOut={onNavigate} />
      </Flex>
    </Box>
  )
}

export default Sidebar
