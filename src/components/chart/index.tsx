import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import * as echarts from 'echarts'

import type { EChartsOption } from 'echarts'

export interface ChartRef {
  download?: echarts.ECharts
  upload?: echarts.ECharts
}

export const Chart = forwardRef<unknown>((_, ref) => {
  const downloadChartContainerRef = useRef<HTMLDivElement>(null)
  const uploadChartContainerRef = useRef<HTMLDivElement>(null)

  const downloadChartRef = useRef<echarts.ECharts | null>(null)
  const uploadChartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!downloadChartContainerRef.current || !uploadChartContainerRef.current)
      return

    downloadChartRef.current = echarts.init(downloadChartContainerRef.current)
    uploadChartRef.current = echarts.init(uploadChartContainerRef.current)

    const baseOption: EChartsOption = {
      animation: false,
      grid: {
        bottom: 1,
        containLabel: false,
        left: 1,
        right: 1,
        top: 1,
      },
      tooltip: {
        show: false,
      },
      xAxis: {
        boundaryGap: false,
        show: false,
        type: 'category',
      },
    }

    const downloadOption: EChartsOption = {
      ...baseOption,
      backgroundColor: 'transparent',
      series: [
        {
          areaStyle: {
            color: 'rgba(0, 166, 237, 0.2)',
          },
          cursor: 'default',
          emphasis: {
            disabled: true,
          },
          lineStyle: {
            color: '#00A6ED',
            width: 2,
          },
          name: 'download',
          showSymbol: false,
          smooth: true,
          type: 'line',
        },
      ],
      yAxis: {
        max: (value: { max: number }) => value.max * 1.2,
        min: 0,
        show: false,
        type: 'value',
      },
    }

    const uploadOption: EChartsOption = {
      ...baseOption,
      backgroundColor: 'transparent',
      series: [
        {
          areaStyle: {
            color: 'rgba(255, 87, 34, 0.2)',
          },
          cursor: 'default',
          data: [],
          emphasis: {
            disabled: true,
          },
          lineStyle: {
            color: '#FF5722',
            width: 2,
          },
          name: 'upload',
          showSymbol: false,
          smooth: true,
          type: 'line',
        },
      ],
      yAxis: {
        min: 0,
        show: false,
        type: 'value',
      },
    }

    downloadChartRef.current.setOption(downloadOption)
    uploadChartRef.current.setOption(uploadOption)

    return () => {
      downloadChartRef.current?.dispose()
      uploadChartRef.current?.dispose()
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      get download() {
        return downloadChartRef.current
      },
      get upload() {
        return uploadChartRef.current
      },
    }),
    [],
  )

  return (
    <div className='relative size-full select-none'>
      <div ref={downloadChartContainerRef} className='absolute inset-0' />
      <div ref={uploadChartContainerRef} className='absolute inset-0 z-10' />
    </div>
  )
})
