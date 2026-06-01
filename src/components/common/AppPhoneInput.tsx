import { useMemo, useState } from 'react'
import { HStack, Select, type InputProps } from '@chakra-ui/react'
import AppInput from './AppInput'
import { allCountries } from 'country-telephone-data'

const getFlagEmoji = (iso2: string) =>
  iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))

const countries = allCountries.map((country) => ({
  name: country.name.replace(/\s*\(.+\)\s*/g, '').trim(),
  iso2: country.iso2,
  dialCode: country.dialCode,
  flag: getFlagEmoji(country.iso2),
}))

type AppPhoneInputProps = Omit<InputProps, 'type'>

function AppPhoneInput(props: AppPhoneInputProps) {
  const defaultCountry = useMemo(
    () => countries.find((country) => country.iso2 === 'in') ?? countries[0],
    [],
  )
  const [selectedCode, setSelectedCode] = useState(defaultCountry.dialCode)
  const selectedCountry = countries.find((country) => country.dialCode === selectedCode) ?? defaultCountry

  return (
    <HStack spacing={2} align="stretch">
      <Select
        value={selectedCode}
        onChange={(event) => setSelectedCode(event.target.value)}
        h="52px"
        w={{ base: '136px', sm: '154px' }}
        bg="#f7faf9"
        color="#172033"
        borderColor="blackAlpha.200"
        _focusVisible={{ borderColor: '#315f57', boxShadow: '0 0 0 1px #315f57' }}
      >
        {countries.map((country) => (
          <option key={`${country.iso2}-${country.dialCode}`} value={country.dialCode}>
            {country.flag} +{country.dialCode}
          </option>
        ))}
      </Select>
      <AppInput
        type="tel"
        flex="1"
        placeholder={`${selectedCountry.flag} +${selectedCountry.dialCode} phone number`}
        {...props}
      />
    </HStack>
  )
}

export default AppPhoneInput
