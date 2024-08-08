import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { StateProvider } from '../store.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StateProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </StateProvider>
  </React.StrictMode>,
)
