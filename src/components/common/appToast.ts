import type { CreateToastFnReturn, UseToastOptions } from '@chakra-ui/react'

type AppToastOptions = Pick<UseToastOptions, 'title' | 'description' | 'status' | 'duration'>

export const AppToast = (toast: CreateToastFnReturn, options: AppToastOptions) => {
  toast({
    position: 'top-right',
    isClosable: true,
    ...options,
  })
}