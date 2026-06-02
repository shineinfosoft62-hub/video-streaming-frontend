import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, type ChakraProviderProps } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

const localStorageKeysToRemove = ['chakra-ui-color-mode', 'loglevel']

const removeExtraLocalStorageKeys = () => {
  localStorageKeysToRemove.forEach((key) => localStorage.removeItem(key))
}

const colorModeManager: ChakraProviderProps['colorModeManager'] = {
  type: 'localStorage',
  get: (init) => init,
  set: () => undefined,
}

removeExtraLocalStorageKeys()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider resetCSS={false} colorModeManager={colorModeManager}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)

requestAnimationFrame(removeExtraLocalStorageKeys)
