import { AnimatePresence } from 'motion/react'

import { Home } from './components/home'
import { Result } from './components/result'
import { Page, useSelector } from './context'

import './App.css'

function App() {
  const [page] = useSelector((state) => state.page)
  return (
    <div className='flex h-screen w-screen items-center justify-center p-3 transition-colors dark:bg-zinc-950'>
      <AnimatePresence mode='wait'>
        {page === Page.Home ? <Home /> : <Result />}
      </AnimatePresence>
    </div>
  )
}

export default App
