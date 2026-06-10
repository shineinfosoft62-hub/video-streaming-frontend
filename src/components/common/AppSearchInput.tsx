import {
  CloseButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  type InputProps,
  useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import AppInput from './AppInput'

type AppSearchInputProps = Omit<InputProps, 'type'> & {
  onClear?: () => void
}

function AppSearchInput({
  value,
  placeholder = 'Search',
  onClear,
  maxW,
  h,
  rounded,
  bg,
  borderColor,
  color,
  _placeholder,
  _focusVisible,
  ...props
}: AppSearchInputProps) {
  const hasValue = typeof value === 'string' && value.length > 0
  const defaultBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.100')
  const defaultBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.100')
  const defaultColor = useColorModeValue('#172033', 'white')
  const iconColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500')
  const clearColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const clearHoverColor = useColorModeValue('#172033', 'white')
  const clearHoverBg = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')

  return (
    <InputGroup maxW={maxW}>
      <InputLeftElement pointerEvents="none" h={h ?? '44px'} w="46px">
        <SearchIcon color={iconColor} />
      </InputLeftElement>
      <AppInput
        type="text"
        role="searchbox"
        value={value}
        h={h ?? '44px'}
        rounded={rounded ?? 'full'}
        bg={bg ?? defaultBg}
        borderColor={borderColor ?? defaultBorderColor}
        color={color ?? defaultColor}
        placeholder={placeholder}
        pl="46px"
        pr={hasValue ? 10 : undefined}
        _placeholder={_placeholder ?? { color: iconColor }}
        _focusVisible={_focusVisible ?? { borderColor: '#14b8a6', boxShadow: '0 0 0 1px #14b8a6' }}
        {...props}
      />
      {hasValue && onClear && (
        <InputRightElement h={h ?? '44px'}>
          <CloseButton size="sm" color={clearColor} _hover={{ color: clearHoverColor, bg: clearHoverBg }} onClick={onClear} />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default AppSearchInput
