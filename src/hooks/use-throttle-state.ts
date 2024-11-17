import { useRef, useState } from 'react'

import { throttle } from 'lodash-es'

export const useThrottleState = <T>(initialState: T, delay = 1000) => {
  const [state, setState] = useState<T>(initialState)
  const throttledSetState = useRef(
    throttle(setState, delay, { leading: true, trailing: true }),
  ).current
  return [state, throttledSetState] as const
}
