import { Box, HStack, Icon, Stack, Text, type BoxProps, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { FiLogOut, FiShield } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { getApiErrorMessage, logoutUser } from '../../service/auth'
import { clearAuthTokens } from '../../service/authTokens'
import AppButton from './AppButton'
import AppConfirmationDialog from './AppConfirmationDialog'
import useAppToast from './useAppToast'

type AppLogoutButtonMode = 'sidebar' | 'settings'

type AppLogoutButtonProps = BoxProps & {
  mode?: AppLogoutButtonMode
  onLoggedOut?: () => void
}

function AppLogoutButton({ mode = 'sidebar', onLoggedOut, ...props }: AppLogoutButtonProps) {
  const navigate = useNavigate()
  const { showApiToast } = useAppToast()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const response = await logoutUser()

      showApiToast(response.message, 'success')
      clearAuthTokens()
      onClose()
      onLoggedOut?.()
      navigate(ROUTES.SIGN_IN)
    } catch (error) {
      showApiToast(getApiErrorMessage(error), 'error')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isSettingsMode = mode === 'settings'

  return (
    <Box
      rounded={isSettingsMode ? '2xl' : 'xl'}
      bg={isSettingsMode ? 'rgba(225, 29, 72, 0.1)' : 'whiteAlpha.100'}
      border="1px solid"
      borderColor={isSettingsMode ? 'rgba(225, 29, 72, 0.28)' : 'whiteAlpha.100'}
      p={isSettingsMode ? { base: 5, md: 6 } : 4}
      {...props}
    >
      <Stack
        direction={isSettingsMode ? { base: 'column', md: 'row' } : 'column'}
        align={isSettingsMode ? { base: 'stretch', md: 'center' } : 'stretch'}
        justify="space-between"
        spacing={4}
      >
        <HStack spacing={4} minW={0} flex="1" align="center">
          {isSettingsMode && (
            <Box display="grid" placeItems="center" boxSize="46px" rounded="full" bg="#e11d48" color="white" flexShrink={0}>
              <Icon as={FiShield} boxSize={5} />
            </Box>
          )}
          <Box minW={0}>
            {isSettingsMode && (
              <Text fontWeight="bold" color="white">
                Account session
              </Text>
            )}
            <Text fontSize="sm" color="whiteAlpha.600" lineHeight="5">
              {isSettingsMode
                ? 'End this session securely and return to the sign in screen.'
                : 'End your current session.'}
            </Text>
          </Box>
       
        </HStack>

        <AppButton
          type="button"
          leftIcon={<Icon as={FiLogOut} />}
          h={isSettingsMode ? '46px' : '42px'}
          w={{ base: 'full', md: isSettingsMode ? '160px' : 'full' }}
          flexShrink={0}
          bg="#e11d48"
          color="white"
          _hover={{ bg: '#be123c' }}
          onClick={onOpen}
        >
          Logout
        </AppButton>
      </Stack>

      <AppConfirmationDialog
        isOpen={isOpen}
        title="Logout?"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        isConfirming={isLoggingOut}
        onClose={onClose}
        onConfirm={handleLogout}
      />
    </Box>
  )
}

export default AppLogoutButton
