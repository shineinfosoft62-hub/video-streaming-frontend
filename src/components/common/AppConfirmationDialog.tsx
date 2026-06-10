import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  type AlertDialogProps,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRef } from 'react'
import AppButton from './AppButton'

type AppConfirmationDialogProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isConfirming?: boolean
  onClose: () => void
  onConfirm: () => void
}

function AppConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isConfirming = false,
  onClose,
  onConfirm,
}: AppConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const contentBg = useColorModeValue('white', '#111827')
  const contentColor = useColorModeValue('#172033', 'white')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')
  const bodyColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const cancelBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')
  const cancelHoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as AlertDialogProps['leastDestructiveRef']}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.700" backdropFilter="blur(8px)">
        <AlertDialogContent bg={contentBg} color={contentColor} border="1px solid" borderColor={borderColor}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody color={bodyColor}>
            {message}
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            <AppButton
              ref={cancelRef}
              type="button"
              variant="ghost"
              bg={cancelBg}
              color={contentColor}
              _hover={{ bg: cancelHoverBg }}
              onClick={onClose}
            >
              {cancelLabel}
            </AppButton>
            <AppButton
              type="button"
              bg="#e11d48"
              color="white"
              _hover={{ bg: '#be123c' }}
              isLoading={isConfirming}
              onClick={onConfirm}
            >
              {confirmLabel}
            </AppButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default AppConfirmationDialog
