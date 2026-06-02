import {
  CloseButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  type InputProps,
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

  return (
    <InputGroup maxW={maxW}>
      <InputLeftElement pointerEvents="none" h={h ?? '44px'} w="46px">
        <SearchIcon color="whiteAlpha.500" />
      </InputLeftElement>
      <AppInput
        type="text"
        role="searchbox"
        value={value}
        h={h ?? '44px'}
        rounded={rounded ?? 'full'}
        bg={bg ?? 'whiteAlpha.100'}
        borderColor={borderColor ?? 'whiteAlpha.100'}
        color={color ?? 'white'}
        placeholder={placeholder}
        pl="46px"
        pr={hasValue ? 10 : undefined}
        _placeholder={_placeholder ?? { color: 'whiteAlpha.500' }}
        _focusVisible={_focusVisible ?? { borderColor: '#14b8a6', boxShadow: '0 0 0 1px #14b8a6' }}
        {...props}
      />
      {hasValue && onClear && (
        <InputRightElement h={h ?? '44px'}>
          <CloseButton size="sm" color="whiteAlpha.700" _hover={{ color: 'white', bg: 'whiteAlpha.100' }} onClick={onClear} />
        </InputRightElement>
      )}
    </InputGroup>
  )
}

export default AppSearchInput
