import { AnimatePresence, motion } from 'motion/react'

export interface AnimateTextProps {
  value: number | string
}

export const AnimateText = ({ value }: AnimateTextProps) => (
  <AnimatePresence mode='wait'>
    <motion.span
      key={value}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {value}
    </motion.span>
  </AnimatePresence>
)
