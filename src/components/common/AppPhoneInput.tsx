import { Box, type BoxProps, useColorModeValue } from '@chakra-ui/react'
import { useState, type ComponentType } from 'react'
import PhoneInputModule, { type CountryData, type PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneInput = (
  PhoneInputModule as unknown as { default?: ComponentType<PhoneInputProps> }
).default ?? (PhoneInputModule as unknown as ComponentType<PhoneInputProps>)

type AppPhoneInputProps = Omit<BoxProps, 'onChange'> & {
  value?: string
  defaultCountry?: string
  placeholder?: string
  onChange?: (value: string, country: CountryData | object) => void
}

function AppPhoneInput({
  value,
  defaultCountry = 'in',
  placeholder = 'Phone number',
  onChange,
  ...boxProps
}: AppPhoneInputProps) {
  const [phone, setPhone] = useState(value ?? '')
  const inputBg = useColorModeValue('#f7faf9', 'rgba(255, 255, 255, 0.08)')
  const inputBorder = useColorModeValue('rgba(0, 0, 0, 0.16)', 'rgba(255, 255, 255, 0.2)')
  const inputColor = useColorModeValue('#172033', '#ffffff')
  const hoverBg = useColorModeValue('#e6f0ed', 'rgba(255, 255, 255, 0.12)')
  const dropdownBg = useColorModeValue('#ffffff', '#111827')
  const mutedColor = useColorModeValue('#687587', '#cbd5e1')

  const handleChange = (nextValue: string, country: CountryData | object) => {
    setPhone(nextValue)
    onChange?.(nextValue, country)
  }

  return (
    <Box
      sx={{
        '.react-tel-input': {
          width: '100%',
          fontFamily: 'inherit',
        },
        '.react-tel-input .form-control': {
          width: '100%',
          height: '52px',
          background: inputBg,
          borderColor: inputBorder,
          borderRadius: '6px',
          color: inputColor,
          fontSize: '16px',
          paddingLeft: '64px',
        },
        '.react-tel-input .form-control:focus': {
          borderColor: '#315f57',
          boxShadow: '0 0 0 1px #315f57',
        },
        '.react-tel-input .flag-dropdown': {
          background: inputBg,
          borderColor: inputBorder,
          borderRadius: '6px 0 0 6px',
        },
        '.react-tel-input .selected-flag': {
          width: '54px',
          borderRadius: '6px 0 0 6px',
        },
        '.react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus, .react-tel-input .flag-dropdown.open .selected-flag': {
          background: hoverBg,
        },
        '.react-tel-input .country-list': {
          width: '320px',
          maxWidth: 'calc(100vw - 48px)',
          marginTop: '8px',
          borderRadius: '6px',
          background: dropdownBg,
          border: `1px solid ${inputBorder}`,
          boxShadow: '0 18px 36px rgba(15, 23, 42, 0.18)',
          color: inputColor,
        },
        '.react-tel-input .country-list .search': {
          padding: '12px 12px 8px',
        },
        '.react-tel-input .country-list .search-box': {
          width: 'calc(100% - 32px)',
          height: '38px',
          background: inputBg,
          borderColor: inputBorder,
          borderRadius: '6px',
          color: inputColor,
          fontSize: '15px',
          marginLeft: '8px',
        },
        '.react-tel-input .country-list .search-box:focus': {
          borderColor: '#315f57',
          boxShadow: '0 0 0 1px #315f57',
          outline: 'none',
        },
        '.react-tel-input .country-list .country': {
          alignItems: 'center',
          display: 'flex',
          minHeight: '38px',
          padding: '8px 12px',
        },
        '.react-tel-input .country-list .country:hover, .react-tel-input .country-list .country.highlight': {
          background: hoverBg,
        },
        '.react-tel-input .country-list .country-name': {
          color: inputColor,
          fontWeight: 600,
          marginLeft: '10px',
        },
        '.react-tel-input .country-list .dial-code': {
          color: mutedColor,
          marginLeft: '8px',
        },
      }}
      {...boxProps}
    >
      <PhoneInput
        country={defaultCountry}
        value={phone}
        onChange={handleChange}
        enableSearch
        searchPlaceholder="search"
        placeholder={placeholder}
        inputProps={{
          name: 'phone',
          type: 'tel',
          autoComplete: 'tel',
        }}
      />
    </Box>
  )
}

export default AppPhoneInput
