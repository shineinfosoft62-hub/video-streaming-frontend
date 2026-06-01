import AppInput from './AppInput'
import type { InputProps } from '@chakra-ui/react'

function AppDateInput(props: InputProps) {
  return <AppInput type="date" {...props} />
}

export default AppDateInput
