import { Box, HStack, Icon, Stack, Text, VStack, type BoxProps, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { FiLogOut,} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { getApiErrorMessage, logoutUser } from '../../service/auth'
import { clearAuthTokens } from '../../service/authTokens'
import AppButton from './AppButton'
import AppConfirmationDialog from './AppConfirmationDialog'
import useAppToast from './useAppToast'

type AppLogoutButtonVariant = 'sidebar' 

type AppLogoutButtonProps = BoxProps & {
  variant?: AppLogoutButtonVariant
  onLoggedOut?: () => void
}

function AppLogoutButton({ variant = 'sidebar', onLoggedOut, ...props }: AppLogoutButtonProps) {
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

  

  return (
    <Box
      rounded={'xl'}
      bg={  'whiteAlpha.100'}
      border="1px solid"
      borderColor={ 'whiteAlpha.100'}
      p={ 4}
      {...props}
    >
      <Stack
        direction={  'column'}
        align={ 'stretch'}
        justify="space-between"
        spacing={4}
      >
        <HStack spacing={4} minW={0} flex="1">
            <Text fontSize="sm" color="whiteAlpha.600" lineHeight="5">
              {'End your current session.'}
            </Text>
       
        </HStack>

        <AppButton
          type="button"
          leftIcon={<Icon as={FiLogOut} />}
          h={ '42px'}
          w={{ base: 'full', sm:'full' }}
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
