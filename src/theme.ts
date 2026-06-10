import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0b0d12' : '#f6f8fb',
        color: props.colorMode === 'dark' ? 'white' : '#172033',
      },
    }),
  },
})

export default theme
