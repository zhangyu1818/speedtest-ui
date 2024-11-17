import { clsx } from 'clsx'

import { Text } from '@/components/styled'

interface ValueTextProps {
  children: React.ReactNode
  loading: boolean
}

export const ValueText = (props: ValueTextProps) => {
  const { children, loading } = props
  return (
    <Text
      className={clsx(
        'transition-colors',
        loading
          ? 'text-gray-600 dark:text-zinc-400'
          : 'text-gray-900 dark:text-zinc-100',
      )}
    >
      {children}
    </Text>
  )
}
