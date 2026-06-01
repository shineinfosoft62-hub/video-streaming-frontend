import { Badge, type BadgeProps } from '@chakra-ui/react'

function AppBadge({
  rounded,
  borderRadius,
  bg,
  background,
  backgroundColor,
  color,
  px,
  py,
  fontWeight,
  letterSpacing,
  textTransform,
  ...props
}: BadgeProps) {
  return (
    <Badge
      rounded={rounded ?? borderRadius ?? 'full'}
      bg={bg ?? background ?? backgroundColor ?? '#42a393'}
      color={color ?? '#041311'}
      px={px ?? 4}
      py={py ?? 2}
      fontWeight={fontWeight ?? 'bold'}
      letterSpacing={letterSpacing ?? '0.04em'}
      textTransform={textTransform ?? 'none'}
      {...props}
    />
  )
}

export default AppBadge
