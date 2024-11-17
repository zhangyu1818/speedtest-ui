import { useEffect, useRef } from 'react'

import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

import type {
  Download,
  Ping,
  TestEvent,
  TestResult,
  TestStart,
  Upload,
} from '../interface'

export interface SpeedtestCallback {
  download?: (payload: Download) => void
  ping?: (payload: Ping) => void
  result?: (payload: TestResult) => void
  testStart?: (payload: TestStart) => void
  upload?: (payload: Upload) => void
}

export const useSpeedtest = (cb: SpeedtestCallback) => {
  const cbRef = useRef<SpeedtestCallback>(cb)
  const isCalled = useRef(false)

  cbRef.current = cb

  useEffect(() => {
    if (isCalled.current) {
      return
    }
    isCalled.current = true

    let unlisten: VoidFunction | null = null

    ;(async () => {
      unlisten = await listen('speedtest', (event) => {
        const payload = event.payload as TestEvent
        switch (payload.type) {
          case 'testStart':
            cbRef.current.testStart?.(payload)
            break
          case 'ping':
            cbRef.current.ping?.(payload)
            break
          case 'download':
            cbRef.current.download?.(payload)
            break
          case 'upload':
            cbRef.current.upload?.(payload)
            break
          case 'result':
            cbRef.current.result?.(payload)
            break
        }
      })

      await invoke('run_speedtest')
    })()

    return () => {
      unlisten?.()
    }
  }, [])

  return () => invoke('run_speedtest')
}
