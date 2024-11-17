export type EventType = 'download' | 'ping' | 'result' | 'testStart' | 'upload'

export interface LatencyInfo {
  high: number
  iqm: number
  jitter: number
  low: number
}

export interface Speed {
  bandwidth: number
  bytes: number
  elapsed: number
  latency?: Partial<LatencyInfo>
  progress: number
}

export interface SpeedResult {
  bandwidth: number
  bytes: number
  elapsed: number
  latency: LatencyInfo
}

export interface Server {
  country: string
  id: number
  location: string
  name: string
}

export interface TestStart {
  server: Server
  timestamp: string
  type: 'testStart'
}

export interface Ping {
  ping: {
    jitter: number
    latency: number
    progress: number
  }
  timestamp: string
  type: 'ping'
}

export interface Download {
  download: Speed
  timestamp: number
  type: 'download'
}

export interface Upload {
  timestamp: number
  type: 'upload'
  upload: Speed
}

export interface TestResult {
  download: SpeedResult
  timestamp: number
  type: 'result'
  upload: SpeedResult
}

export type TestEvent = Download | Ping | TestResult | TestStart | Upload
