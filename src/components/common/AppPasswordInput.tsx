import { useState } from 'react'
import { IconButton, InputGroup, InputRightElement, type InputProps } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import AppInput from './AppInput'

function AppPasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <InputGroup>
      <AppInput type={isVisible ? 'text' : 'password'} pr="3.25rem" {...props} />
      <InputRightElement h="52px">
        <IconButton
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          icon={isVisible ? <ViewOffIcon /> : <ViewIcon />}
          size="sm"
          variant="ghost"
          color="blackAlpha.700"
          _hover={{ bg: 'whiteAlpha.100', color: 'blackAlpha.700' }}
          onClick={() => setIsVisible((current) => !current)}
        />
      </InputRightElement>
    </InputGroup>
  )
}

export default AppPasswordInput
