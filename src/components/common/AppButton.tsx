import { Button, type ButtonProps } from '@chakra-ui/react'
import { forwardRef, type ElementType } from 'react'

type AppButtonProps = ButtonProps & {
  as?: ElementType
  to?: string
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(function AppButton({
  variant,
  rounded,
  borderRadius,
  bg,
  background,
  backgroundColor,
  color,
  h,
  px,
  fontWeight,
  _hover,
  _active,
  ...props
}, ref) {
  const usesPrimaryDefaults = !variant || variant === 'solid'
  const hasCustomBg = Boolean(bg ?? background ?? backgroundColor)
  const defaultHover = usesPrimaryDefaults
    ? { bg: hasCustomBg ? undefined : '#be123c', textDecoration: 'none' }
    : { textDecoration: 'none' }
  const defaultActive = usesPrimaryDefaults ? { bg: hasCustomBg ? undefined : '#9f1239' } : undefined
  const buttonProps = {
    ...props,
    variant,
    rounded: rounded ?? borderRadius ?? 'full',
    bg: bg ?? background ?? backgroundColor ?? (usesPrimaryDefaults ? '#e11d48' : undefined),
    color: color ?? (usesPrimaryDefaults || hasCustomBg ? 'white' : undefined),
    h: h ?? '42px',
    px: px ?? 5,
    fontWeight: fontWeight ?? 'bold',
    _hover: _hover ?? defaultHover,
    _active: _active ?? defaultActive,
  } as ButtonProps

  return <Button ref={ref} {...buttonProps} />
})

export default AppButton
