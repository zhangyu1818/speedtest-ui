import { useMemo, useState } from 'react'

import { IconMoonFilled, IconSunFilled } from '@tabler/icons-react'
import { setTheme } from '@tauri-apps/api/app'
import { createDarkToggle } from 'dark-toggle'
import { AnimatePresence, motion } from 'motion/react'

export const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false)

  const darkToggle = useMemo(() => {
    const darkToggle = createDarkToggle({
      key: 'theme',
    })

    darkToggle.subscribe((dark) => {
      setIsDark(dark)
      setTheme(dark ? 'dark' : 'light')

      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })

    return darkToggle
  }, [])

  return (
    <button
      className='absolute right-3 top-3 rounded-full p-1 text-gray-500 transition-transform hover:scale-[1.3] dark:text-zinc-500'
      onClick={darkToggle.toggle}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          initial={{ scale: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <IconMoonFilled className='size-5' />
          ) : (
            <IconSunFilled className='size-5' />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
