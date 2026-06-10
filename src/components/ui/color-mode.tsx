import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'

function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')
  const color = useColorModeValue('#172033', 'white')
  const hoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.200')

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      rounded="full"
      bg={bg}
      color={color}
      _hover={{ bg: hoverBg }}
      onClick={toggleColorMode}
    />
  )
}

export { ColorModeButton }
