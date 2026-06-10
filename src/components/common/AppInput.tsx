import { forwardRef } from 'react'
import {
  Input,
  type InputProps,
  useColorModeValue,
} from '@chakra-ui/react'
import AppTextarea from './AppTextarea'
import { sharedInputStyles } from './inputStyles'

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
  const defaultBg = useColorModeValue(sharedInputStyles.light.bg, sharedInputStyles.dark.bg)
  const defaultColor = useColorModeValue(sharedInputStyles.light.color, sharedInputStyles.dark.color)
  const defaultBorderColor = useColorModeValue(sharedInputStyles.light.borderColor, sharedInputStyles.dark.borderColor)
  const defaultFocus = useColorModeValue(sharedInputStyles.light._focusVisible, sharedInputStyles.dark._focusVisible)
  const placeholderColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500')

  return (
    <Input
      ref={ref}
      bg={bg ?? defaultBg}
      color={color ?? defaultColor}
      borderColor={borderColor ?? defaultBorderColor}
      h={h ?? '52px'}
      rounded={rounded ?? borderRadius}
      _placeholder={{ color: placeholderColor }}
      _focusVisible={_focusVisible ?? defaultFocus}
      {...props}
    />
  )
})

export default AppInput
export { AppTextarea }
