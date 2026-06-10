import { forwardRef } from 'react'
import {
  Input,
  type InputProps,
  useColorModeValue,
} from '@chakra-ui/react'
import AppTextarea from './AppTextarea'
import { focusRing } from './inputStyles'

const AppInput = forwardRef<HTMLInputElement, InputProps>(function AppInput(
  {
    bg,
    color,
    borderColor,
    h,
    rounded,
    borderRadius,
    _focusVisible,
    ...props
  },
  ref,
) {
  const defaultBg = useColorModeValue('#f7faf9', 'whiteAlpha.100')
  const defaultColor = useColorModeValue('#172033', 'white')
  const defaultBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  return (
    <Input
      ref={ref}
      bg={bg ?? defaultBg}
      color={color ?? defaultColor}
      borderColor={borderColor ?? defaultBorderColor}
      h={h ?? '52px'}
      rounded={rounded ?? borderRadius}
      _focusVisible={_focusVisible ?? focusRing}
      {...props}
    />
  )
})

export default AppInput
export { AppTextarea }
