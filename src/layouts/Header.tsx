import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AppSearchInput from '../components/common/AppSearchInput'
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
          <Box as="form" w="100%" maxW={{ base: 'full', md: '520px' }} onSubmit={handleSearchSubmit}>
            <AppSearchInput
              value={searchValue}
              placeholder="Search videos"
              maxW="full"
              onChange={handleSearchChange}
              onClear={handleSearchClear}
            />
          </Box>
        </HStack>      
          <HStack
            as={RouterLink}
            to={ROUTES.DASHBOARD_PROFILE}
            spacing={3}
            display="flex"
            rounded="full"
            px={2}
            py={1}
            _hover={{ textDecoration: 'none' }}
          >
            <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                {displayName}
              </Text>
            </Box>
            <Avatar name={displayName} size="sm" bg="#14b8a6" color="#041311" />
          </HStack>
      </Flex>
    </Box>
  )
}

export default Header
