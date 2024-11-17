import { IconGauge } from '@tabler/icons-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Page, useSelector, type Unit } from '@/context'

import { ThemeSwitcher } from '../theme-switcher'

export const Home = () => {
  const [unit, setUnit] = useSelector((state) => state.unit)
  const [, setPage] = useSelector((state) => state.page)
  return (
    <>
      <ThemeSwitcher />
      <motion.div
        key='Home'
        animate={{ opacity: 1, y: 0 }}
        className='flex h-full flex-col'
        exit={{ opacity: 0, y: -50 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex flex-1 flex-col items-center justify-center gap-6 pt-4'>
          <IconGauge className='size-12' />
          <Button size='lg' onClick={() => setPage(Page.Result)}>
            Speedtest
          </Button>
          <ToggleGroup
            size='sm'
            type='single'
            value={unit}
            onValueChange={(value) => {
              if (value) {
                setUnit(value as Unit)
              }
            }}
          >
            <ToggleGroupItem value='Mbps'>Mbps</ToggleGroupItem>
            <ToggleGroupItem value='MB/s'>MB/s</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <p className='text-xs text-muted-foreground'>
          Powered by{' '}
          <a
            className='underline'
            href='https://www.speedtest.net/apps/cli'
            rel='noreferrer'
            target='_blank'
          >
            Speedtest® CLI
          </a>{' '}
          and Tauri.
        </p>
      </motion.div>
    </>
  )
}
