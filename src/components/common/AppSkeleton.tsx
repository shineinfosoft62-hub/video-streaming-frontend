import { Skeleton, type SkeletonProps } from '@chakra-ui/react'

function AppSkeleton({
  rounded,
  borderRadius,
  startColor,
  endColor,
  speed,
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      rounded={rounded ?? borderRadius ?? 'md'}
      startColor={startColor ?? 'whiteAlpha.100'}
      endColor={endColor ?? 'whiteAlpha.300'}
      speed={speed ?? 0.9}
      {...props}
    />
  )
}

export default AppSkeleton
