import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'

function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  const hoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const color = useColorModeValue('#172033', 'white')

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
      icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      variant="ghost"
      rounded="full"
      color={color}
      _hover={{ bg: hoverBg }}
      onClick={toggleColorMode}
    />
  )
}

export default ColorModeButton
