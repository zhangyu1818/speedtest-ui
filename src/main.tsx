import React from 'react'
import ReactDOM from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'

import App from './App'
import { Provider } from './context'

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
      <Toaster />
    </Provider>
  </React.StrictMode>,
)
