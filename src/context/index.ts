import { useState } from 'react'

import { createContextFactory } from '@reactils/create-context-factory'

// eslint-disable-next-line no-restricted-syntax
export const enum Unit {
  MBs = 'MB/s',
  Mbps = 'Mbps',
}

// eslint-disable-next-line no-restricted-syntax
export const enum Page {
  Home = 'Home',
  Result = 'Result',
}

const useUnit = () => {
  const storedUnit = (localStorage.getItem('unit') || Unit.Mbps) as Unit

  const [unit, setUnit] = useState<Unit>(storedUnit)

  const setUnitWithStorage = (value: Unit) => {
    setUnit(value)
    localStorage.setItem('unit', value)
  }

  return [unit, setUnitWithStorage] as const
}

const [Provider, useSelector] = createContextFactory(() => ({
  page: useState<Page>(Page.Home),
  unit: useUnit(),
}))

export { Provider, useSelector }
