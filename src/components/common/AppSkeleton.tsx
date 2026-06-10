import { Skeleton, type SkeletonProps, useColorModeValue } from '@chakra-ui/react'

function AppSkeleton({
  rounded,
  borderRadius,
  startColor,
  endColor,
  speed,
  ...props
}: SkeletonProps) {
  const defaultStartColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const defaultEndColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')

  return (
    <Skeleton
      rounded={rounded ?? borderRadius ?? 'md'}
      startColor={startColor ?? defaultStartColor}
      endColor={endColor ?? defaultEndColor}
      speed={speed ?? 0.9}
      {...props}
    />
  )
}

export default AppSkeleton
