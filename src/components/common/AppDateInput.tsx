import { LuCalendar } from "react-icons/lu"
import {
  Box,
  IconButton,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  type InputProps,
} from '@chakra-ui/react'
import { useMemo, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import AppInput from './AppInput'

type CalendarValue = Date | null | [Date | null, Date | null]

type AppDateInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> & {
  value?: string
  defaultValue?: string
  minDate?: Date
  maxDate?: Date
  onChange?: (value: string, date: Date | null) => void
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const parseDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (formatDate(date) !== value) {
    return null
  }

  return date
}

const allowedDateKeys = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
])

function AppDateInput({
  value,
  defaultValue = '',
  minDate,
  maxDate,
  placeholder = 'YYYY-MM-DD',
  onChange,
  ...inputProps
}: AppDateInputProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const inputValue = isControlled ? value : internalValue
  const selectedDate = useMemo(() => parseDate(inputValue), [inputValue])

  const updateValue = (nextValue: string, nextDate: Date | null) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue, nextDate)
  }

  const handleCalendarChange = (nextValue: CalendarValue) => {
    if (!(nextValue instanceof Date)) {
      return
    }

    updateValue(formatDate(nextValue), nextValue)
    setIsOpen(false)
  }

  const handleBlur = () => {
    const nextDate = parseDate(inputValue)

    if (nextDate) {
      updateValue(formatDate(nextDate), nextDate)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    inputProps.onKeyDown?.(event)

    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      allowedDateKeys.has(event.key) ||
      /^[0-9-]$/.test(event.key)
    ) {
      return
    }

    event.preventDefault()
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    inputProps.onPaste?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (/[^0-9-]/.test(event.clipboardData.getData('text'))) {
      event.preventDefault()
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      closeOnBlur
    >
      <PopoverTrigger>
        <Box>
          <InputGroup>
            <AppInput
              {...inputProps}
              type="text"
              inputMode="numeric"
              placeholder={placeholder}
              value={inputValue}
              pr="3.25rem"
              onChange={(event) => updateValue(event.target.value, parseDate(event.target.value))}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
            <InputRightElement h={inputProps.h ?? '52px'} w="3.25rem">
              <IconButton
                aria-label="Select date"
                icon={<LuCalendar />}
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
          w="fit-content"
          borderColor="blackAlpha.200"
          boxShadow="xl"
          overflow="hidden"
          _focusVisible={{ boxShadow: 'xl' }}
        >
          <Box
            bg="white"
            color="#172033"
          >
            <Calendar
              value={selectedDate}
              onChange={handleCalendarChange}
              minDate={minDate}
              maxDate={maxDate}
            />
          </Box>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default AppDateInput
