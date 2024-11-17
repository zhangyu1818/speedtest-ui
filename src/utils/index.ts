import { round } from 'lodash-es'

import { Unit } from '@/context'

const defaultChar = '-'

export function roundOrDefault(value?: number, defaultValue = defaultChar) {
  return value ? round(value) : defaultValue
}

export function bandwidthConvertOrDefault(
  unit: Unit,
  value?: number,
  defaultValue = defaultChar,
) {
  if (!value) {
    return defaultValue
  }
  if (unit === Unit.Mbps) {
    return round((value * 8) / 1_000_000, 2)
  }
  return round(value / 1_000_000, 2)
}
