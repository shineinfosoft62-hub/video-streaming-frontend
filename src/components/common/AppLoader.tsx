import { Box, Progress, Spinner, Stack, Text, type BoxProps } from '@chakra-ui/react'

type AppLoaderProps = {
  label?: string
  progress?: number
} & BoxProps

function AppLoader({ label = 'Loading', progress, ...boxProps }: AppLoaderProps) {
  return (
    <Box
      position="absolute"
      inset={0}
      zIndex={10}
      display="grid"
      placeItems="center"
      bg="rgba(255, 255, 255, 0.82)"
      backdropFilter="blur(4px)"
      rounded="2xl"
      {...boxProps}
    >
      <Stack spacing={4} align="center" w="min(320px, 82%)">
        <Spinner color="#315f57" thickness="4px" size="xl" />
        <Text color="#172033" fontWeight="bold" textAlign="center">
          {label}
        </Text>
        {typeof progress === 'number' && (
          <Progress value={progress} colorScheme="green" rounded="full" w="100%" size="sm" />
        )}
      </Stack>
    </Box>
  )
}

export default AppLoader
