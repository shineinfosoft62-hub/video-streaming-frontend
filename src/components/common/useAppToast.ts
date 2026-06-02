import { useToast, type UseToastOptions } from '@chakra-ui/react'
import { useCallback } from 'react'

type AppToastStatus = 'success' | 'error' | 'warning'

const toastDefaults: Pick<UseToastOptions, 'position' | 'isClosable' | 'variant'> = {
  position: 'top-right',
  isClosable: true,
  variant: 'left-accent',
}

function useAppToast() {
  const toast = useToast()

  const showAppToast = useCallback((message: string | undefined, status: AppToastStatus, options?: UseToastOptions) => {
    if (!message) {
      return
    }

    if (options?.id && toast.isActive(options.id)) {
      return
    }

    toast({
      ...toastDefaults,
      ...options,
      description: message,
      status,
      duration: status === 'success' ? 3500 : 4500,
    })
  }, [toast])

  const showApiToast = useCallback((message: string | undefined, status: AppToastStatus) => {
    showAppToast(message, status)
  }, [showAppToast])

  return { showApiToast, showAppToast }
}

export default useAppToast
