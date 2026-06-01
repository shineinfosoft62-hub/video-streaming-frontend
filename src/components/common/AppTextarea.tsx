import { forwardRef } from 'react'
import { Textarea, type TextareaProps } from '@chakra-ui/react'
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
  return (
    <Textarea
      ref={ref}
      bg={bg ?? sharedInputStyles.bg}
      color={color ?? sharedInputStyles.color}
      borderColor={borderColor ?? sharedInputStyles.borderColor}
      rounded={rounded ?? borderRadius}
      resize={resize ?? 'vertical'}
      _focusVisible={_focusVisible ?? sharedInputStyles._focusVisible}
      {...props}
    />
  )
})

export default AppTextarea
