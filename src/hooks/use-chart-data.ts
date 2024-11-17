import { useRef } from 'react'

import type { ChartRef } from '@/components/chart'
import type { Download, Upload } from '@/interface'

export const useChartData = () => {
  const downloadList = useRef<Download[]>([])
  const uploadList = useRef<Upload[]>([])

  const downloadMaxValue = useRef<null | number>(null)

  const chartRef = useRef<ChartRef>(null)

  function updateDownloadChart() {
    chartRef.current?.download?.setOption({
      series: [
        {
          data: downloadList.current.map((d) => d.download.bandwidth),
          name: 'download',
        },
      ],
    })
  }

  function updateUploadChart() {
    chartRef.current?.upload?.setOption({
      series: [
        {
          data: uploadList.current.map((d) => d.upload.bandwidth),
          name: 'upload',
        },
      ],
      yAxis: {
        max(value: { max: number }) {
          if (downloadMaxValue.current === null) {
            downloadMaxValue.current = Math.max(
              ...downloadList.current.map((d) => d.download.bandwidth),
            )
          }
          return Math.max(downloadMaxValue.current, value.max * 1.2)
        },
      },
    })
  }

  function addDownloadData(data: Download) {
    downloadList.current.push(data)
    updateDownloadChart()
  }

  function addUploadData(data: Upload) {
    uploadList.current.push(data)
    updateUploadChart()
  }

  function clearData() {
    downloadList.current = []
    uploadList.current = []
    updateDownloadChart()
    updateUploadChart()
    downloadMaxValue.current = null
  }

  return [chartRef, { addDownloadData, addUploadData, clearData }] as const
}
