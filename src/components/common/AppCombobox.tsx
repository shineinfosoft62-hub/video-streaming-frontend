import { useMemo, useState, type KeyboardEvent } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  type BoxProps,
  type FormControlProps,
  type InputProps,
} from '@chakra-ui/react'
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons'
import AppInput from './AppInput'

export type AppComboboxItem = {
  label: string
  value: string
  disabled?: boolean
}

type AppComboboxProps = Omit<FormControlProps, 'onChange'> & {
  items: AppComboboxItem[]
  label?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  emptyText?: string
  isClearable?: boolean
  inputProps?: Omit<InputProps, 'value' | 'defaultValue' | 'onChange'>
  listProps?: BoxProps
  onValueChange?: (item: AppComboboxItem | null) => void
  onInputValueChange?: (inputValue: string) => void
}

const normalize = (value: string) => value.toLocaleLowerCase()

function AppCombobox({
  items,
  label,
  value,
  defaultValue,
  placeholder = 'Type to search',
  emptyText = 'No items found',
  isClearable = true,
  inputProps,
  listProps,
  onValueChange,
  onInputValueChange,
  ...formControlProps
}: AppComboboxProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const selectedValue = isControlled ? value : internalValue
  const selectedItem = useMemo(
    () => items.find((item) => item.value === selectedValue) ?? null,
    [items, selectedValue],
  )
  const [inputValue, setInputValue] = useState(selectedItem?.label ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const filteredItems = useMemo(() => {
    const query = normalize(inputValue.trim())

    if (!query) {
      return items
    }

    return items.filter((item) => normalize(item.label).includes(query))
  }, [inputValue, items])

  const updateSelection = (item: AppComboboxItem | null) => {
    if (!isControlled) {
      setInternalValue(item?.value ?? '')
    }

    setInputValue(item?.label ?? '')
    setHighlightedIndex(0)
    onValueChange?.(item)
  }

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue)
    setHighlightedIndex(0)
    setIsOpen(true)
    onInputValueChange?.(nextValue)
  }

  const handleSelect = (item: AppComboboxItem) => {
    if (item.disabled) {
      return
    }

    updateSelection(item)
    setIsOpen(false)
  }

  const handleClear = () => {
    updateSelection(null)
    onInputValueChange?.('')
    setIsOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((current) => Math.min(current + 1, filteredItems.length - 1))
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((current) => Math.max(current - 1, 0))
    }

    if (event.key === 'Enter' && isOpen) {
      event.preventDefault()
      const item = filteredItems[highlightedIndex]

      if (item) {
        handleSelect(item)
      }
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <FormControl {...formControlProps}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        matchWidth
        closeOnBlur
      >
        <PopoverTrigger>
          <Box>
            <InputGroup>
              <AppInput
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                placeholder={placeholder}
                value={inputValue}
                pr={isClearable && inputValue ? '5.5rem' : '3rem'}
                onFocus={() => setIsOpen(true)}
                onChange={(event) => handleInputChange(event.target.value)}
                onKeyDown={handleKeyDown}
                {...inputProps}
              />
              <InputRightElement h={inputProps?.h ?? '52px'} w={isClearable && inputValue ? '5.5rem' : '3rem'}>
                {isClearable && inputValue && (
                  <IconButton
                    aria-label="Clear selection"
                    icon={<CloseIcon boxSize={2.5} />}
                    size="sm"
                    variant="ghost"
                    color="#315f57"
                    onClick={handleClear}
                  />
                )}
                <IconButton
                  aria-label="Open options"
                  icon={<ChevronDownIcon boxSize={5} />}
                  size="sm"
                  variant="ghost"
                  color="#315f57"
                  onClick={() => setIsOpen((current) => !current)}
                />
              </InputRightElement>
            </InputGroup>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            w="100%"
            borderColor="blackAlpha.200"
            boxShadow="xl"
            overflow="hidden"
            _focusVisible={{ boxShadow: 'xl' }}
          >
            <Box maxH="240px" overflowY="auto" py={1} {...listProps}>
              {filteredItems.length === 0 ? (
                <Text px={4} py={3} color="gray.500" fontSize="sm">
                  {emptyText}
                </Text>
              ) : (
                <List spacing={0}>
                  {filteredItems.map((item, index) => {
                    const isSelected = item.value === selectedValue
                    const isHighlighted = index === highlightedIndex

                    return (
                      <ListItem
                        key={item.value}
                        px={4}
                        py={2.5}
                        cursor={item.disabled ? 'not-allowed' : 'pointer'}
                        opacity={item.disabled ? 0.5 : 1}
                        bg={isSelected || isHighlighted ? '#e6f0ed' : 'white'}
                        color="#172033"
                        fontWeight={isSelected ? 'semibold' : 'normal'}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => handleSelect(item)}
                      >
                        {item.label}
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </Box>
          </PopoverContent>
        </Portal>
      </Popover>
    </FormControl>
  )
}

export default AppCombobox
