import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  type AlertDialogProps,
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

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef as AlertDialogProps['leastDestructiveRef']}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.700" backdropFilter="blur(8px)">
        <AlertDialogContent bg="#111827" color="white" border="1px solid" borderColor="whiteAlpha.200">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody color="whiteAlpha.700">
            {message}
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            <AppButton
              ref={cancelRef}
              type="button"
              variant="ghost"
              bg="whiteAlpha.100"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
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
