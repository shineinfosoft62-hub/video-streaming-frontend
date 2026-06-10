import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AppSearchInput from '../components/common/AppSearchInput'
import { ColorModeButton } from '../components/ui/color-mode'
import { ROUTES } from '../constants/routes'
import { getAuthUser, getAuthUserDisplayName } from '../service/authTokens'

type HeaderProps = {
  onOpenSidebar: () => void
}

function Header({ onOpenSidebar }: HeaderProps) {
  const user = getAuthUser()
  const displayName = getAuthUserDisplayName(user)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchDraft, setSearchDraft] = useState(searchParams.get('q') ?? '')
  const isVideoListRoute = location.pathname === ROUTES.DASHBOARD
  const searchValue = isVideoListRoute ? searchParams.get('q') ?? '' : searchDraft
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.84)', 'rgba(15, 18, 27, 0.82)')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const textColor = useColorModeValue('#172033', 'white')
  const iconHoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const profileHoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')

  const updateSearchParam = (value: string) => {
    const nextParams = new URLSearchParams(searchParams)

    if (value.trim()) {
      nextParams.set('q', value)
    } else {
      nextParams.delete('q')
    }

    setSearchParams(nextParams, { replace: true })
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value

    setSearchDraft(nextValue)
    if (isVideoListRoute) {
      updateSearchParam(nextValue)
    }
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchValue.trim()

    navigate(query ? `${ROUTES.DASHBOARD}?q=${encodeURIComponent(query)}` : ROUTES.DASHBOARD)
  }

  const handleSearchClear = () => {
    setSearchDraft('')
    if (isVideoListRoute) {
      updateSearchParam('')
      return
    }

    navigate(ROUTES.DASHBOARD)
  }

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="20"
      bg={headerBg}
      borderBottom="1px solid"
      borderColor={borderColor}
      backdropFilter="blur(18px)"
    >
      <Flex h="60px" align="center" justify="space-between" gap={3} px={{ base: 3, md: 5 }}>
        <HStack spacing={3} minW={0} flex="1">
          <IconButton
            aria-label="Open navigation"
            icon={<HamburgerIcon />}
            display={{ base: 'inline-flex', lg: 'none' }}
            variant="ghost"
            color={textColor}
            _hover={{ bg: iconHoverBg }}
            onClick={onOpenSidebar}
          />
          <Box as="form" w="100%" maxW={{ base: 'full', md: '480px' }} onSubmit={handleSearchSubmit}>
            <AppSearchInput
              value={searchValue}
              placeholder="Search videos"
              maxW="full"
              onChange={handleSearchChange}
              onClear={handleSearchClear}
            />
          </Box>
        </HStack>
        <HStack spacing={2} align="center">
          <ColorModeButton />
          <HStack
            as={RouterLink}
            to={ROUTES.DASHBOARD_PROFILE}
            spacing={3}
            display="flex"
            rounded="full"
            px={2}
            py={1}
            _hover={{ bg: profileHoverBg, textDecoration: 'none' }}
          >
            <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {displayName}
              </Text>
            </Box>
            <Avatar name={displayName} size="sm" bg="#14b8a6" color="#041311" />
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
