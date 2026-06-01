import { forwardRef } from 'react'
import {
  Input,
  type InputProps,
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
  return (
    <Input
      ref={ref}
      bg={bg ?? sharedInputStyles.bg}
      color={color ?? sharedInputStyles.color}
      borderColor={borderColor ?? sharedInputStyles.borderColor}
      h={h ?? '52px'}
      rounded={rounded ?? borderRadius}
      _focusVisible={_focusVisible ?? sharedInputStyles._focusVisible}
      {...props}
    />
  )
})

export default AppInput
export { AppTextarea }
