import { useToast, type UseToastOptions } from '@chakra-ui/react'

type AppToastStatus = 'success' | 'error'

const toastDefaults: Pick<UseToastOptions, 'position' | 'isClosable' | 'variant'> = {
  position: 'top-right',
  isClosable: true,
  variant: 'left-accent',
}

function useAppToast() {
  const toast = useToast()

  const showApiToast = (message: string | undefined, status: AppToastStatus) => {
    if (!message) {
      return
    }

    toast({
      ...toastDefaults,
      description: message,
      status,
      duration: status === 'success' ? 3500 : 4500,
    })
  }

  return { showApiToast }
}

export default useAppToast
