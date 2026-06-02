import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AppButton from '../components/common/AppButton'
import AppInput from '../components/common/AppInput'
import { ROUTES } from '../constants/routes'
import { clearAuthTokens, isAuthenticated } from '../service/authTokens'

type HeaderProps = {
  onOpenSidebar: () => void
}

function Header({ onOpenSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const hasAccessToken = isAuthenticated()

  const handleLogout = () => {
    clearAuthTokens()
    navigate(ROUTES.SIGN_IN)
  }

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="20"
      bg="rgba(15, 18, 27, 0.82)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      backdropFilter="blur(18px)"
    >
      <Flex h="72px" align="center" justify="space-between" gap={4} px={{ base: 4, md: 6 }}>
        <HStack spacing={3} minW={0} flex="1">
          <IconButton
            aria-label="Open navigation"
            icon={<HamburgerIcon />}
            display={{ base: 'inline-flex', lg: 'none' }}
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.100' }}
            onClick={onOpenSidebar}
          />

          <InputGroup maxW={{ base: 'full', md: '420px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="whiteAlpha.500" />
            </InputLeftElement>
            <AppInput
              h="44px"
              rounded="full"
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.100"
              color="white"
              placeholder="Search videos"
              _placeholder={{ color: 'whiteAlpha.500' }}
              _focusVisible={{ borderColor: '#14b8a6', boxShadow: '0 0 0 1px #14b8a6' }}
            />
          </InputGroup>
        </HStack>

        <HStack spacing={3}>
          {hasAccessToken && (
            <AppButton
              as={RouterLink}
              to={ROUTES.DASHBOARD_UPLOAD}
              display={{ base: 'none', sm: 'inline-flex' }}
              h="42px"
              rounded="full"
              bg="#e11d48"
              color="white"
              _hover={{ bg: '#be123c', textDecoration: 'none' }}
            >
              Upload
            </AppButton>
          )}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
            <Box textAlign="right">
              <Text fontSize="sm" fontWeight="bold" color="white">
                Admin
              </Text>
              <Text fontSize="xs" color="whiteAlpha.500">
                Streaming manager
              </Text>
            </Box>
            <Avatar name="Streaming Admin" size="sm" bg="#14b8a6" color="#041311" />
          </HStack>
          <AppButton
            type="button"
            h="42px"
            rounded="full"
            bg="whiteAlpha.100"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={handleLogout}
          >
            Logout
          </AppButton>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
