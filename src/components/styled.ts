import { IconLoader2 } from '@tabler/icons-react'
import { tw } from 'tw-styled'

export const Card = tw.div`rounded-lg bg-gray-100 p-3 dark:bg-zinc-900`
export const Title = tw.p`flex items-center gap-1.5 text-sm text-gray-600 dark:text-zinc-400`
export const Text = tw.p`text-lg font-bold`
export const UnitText = tw.small`ml-0.5`
export const DataPanel = tw.div`grid grid-cols-[1fr_1fr] gap-4`
export const LoadingIcon = tw(IconLoader2)`size-2.5 animate-spin text-gray-600`
export const IconButton = tw.button`rounded-full bg-white p-1.5 text-gray-600 shadow-md transition-transform hover:scale-105 dark:bg-zinc-900 dark:text-zinc-400`
