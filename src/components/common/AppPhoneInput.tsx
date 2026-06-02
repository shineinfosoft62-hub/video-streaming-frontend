import { Box, type BoxProps } from '@chakra-ui/react'
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
  onChange?: (value: string, country: CountryData | {}) => void
}

function AppPhoneInput({
  value,
  defaultCountry = 'in',
  placeholder = 'Phone number',
  onChange,
  ...boxProps
}: AppPhoneInputProps) {
  const [phone, setPhone] = useState(value ?? '')

  const handleChange = (nextValue: string, country: CountryData | {}) => {
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
          background: '#f7faf9',
          borderColor: 'rgba(0, 0, 0, 0.16)',
          borderRadius: '6px',
          color: '#172033',
          fontSize: '16px',
          paddingLeft: '64px',
        },
        '.react-tel-input .form-control:focus': {
          borderColor: '#315f57',
          boxShadow: '0 0 0 1px #315f57',
        },
        '.react-tel-input .flag-dropdown': {
          background: '#f7faf9',
          borderColor: 'rgba(0, 0, 0, 0.16)',
          borderRadius: '6px 0 0 6px',
        },
        '.react-tel-input .selected-flag': {
          width: '54px',
          borderRadius: '6px 0 0 6px',
        },
        '.react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus, .react-tel-input .flag-dropdown.open .selected-flag': {
          background: '#e6f0ed',
        },
        '.react-tel-input .country-list': {
          width: '320px',
          maxWidth: 'calc(100vw - 48px)',
          marginTop: '8px',
          borderRadius: '6px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 18px 36px rgba(15, 23, 42, 0.18)',
          color: '#172033',
        },
        '.react-tel-input .country-list .search': {
          padding: '12px 12px 8px',
        },
        '.react-tel-input .country-list .search-box': {
          width: 'calc(100% - 32px)',
          height: '38px',
          borderColor: 'rgba(0, 0, 0, 0.18)',
          borderRadius: '6px',
          color: '#172033',
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
          background: '#e6f0ed',
        },
        '.react-tel-input .country-list .country-name': {
          color: '#172033',
          fontWeight: 600,
          marginLeft: '10px',
        },
        '.react-tel-input .country-list .dial-code': {
          color: '#687587',
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
