import { forwardRef } from 'react'
import { Textarea, type TextareaProps, useColorModeValue } from '@chakra-ui/react'
import { focusRing } from './inputStyles'

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
  const defaultBg = useColorModeValue('#f7faf9', 'whiteAlpha.100')
  const defaultColor = useColorModeValue('#172033', 'white')
  const defaultBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  return (
    <Textarea
      ref={ref}
      bg={bg ?? defaultBg}
      color={color ?? defaultColor}
      borderColor={borderColor ?? defaultBorderColor}
      rounded={rounded ?? borderRadius}
      resize={resize ?? 'vertical'}
      _focusVisible={_focusVisible ?? focusRing}
      {...props}
    />
  )
})

export default AppTextarea
