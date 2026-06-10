import { forwardRef } from 'react'
import { Textarea, type TextareaProps, useColorModeValue } from '@chakra-ui/react'
import { sharedInputStyles } from './inputStyles'

const AppTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function AppTextarea(
  {
    bg,
    color,
    borderColor,
    rounded,
    borderRadius,
    _focusVisible,
    resize,
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
    <Textarea
      ref={ref}
      bg={bg ?? defaultBg}
      color={color ?? defaultColor}
      borderColor={borderColor ?? defaultBorderColor}
      rounded={rounded ?? borderRadius}
      resize={resize ?? 'vertical'}
      _placeholder={{ color: placeholderColor }}
      _focusVisible={_focusVisible ?? defaultFocus}
      {...props}
    />
  )
})

export default AppTextarea
