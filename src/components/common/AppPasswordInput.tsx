import { useState } from 'react'
import { IconButton, InputGroup, InputRightElement, type InputProps, useColorModeValue } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import AppInput from './AppInput'

function AppPasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const iconColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const hoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

  return (
    <InputGroup>
      <AppInput type={isVisible ? 'text' : 'password'} pr="3.25rem" {...props} />
      <InputRightElement h="52px">
        <IconButton
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          icon={isVisible ? <ViewOffIcon /> : <ViewIcon />}
          size="sm"
          variant="ghost"
          color={iconColor}
          _hover={{ bg: hoverBg, color: iconColor }}
          onClick={() => setIsVisible((current) => !current)}
        />
      </InputRightElement>
    </InputGroup>
  )
}

export default AppPasswordInput
