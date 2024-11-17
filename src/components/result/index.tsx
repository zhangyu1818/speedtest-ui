import { useEffect, useState } from 'react'

import { IconArrowBackUp, IconReload } from '@tabler/icons-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'

import { Page, useSelector } from '@/context'
import { useChartData, useSpeedtest, useThrottleState } from '@/hooks'
import { bandwidthConvertOrDefault, roundOrDefault } from '@/utils'

import { AnimateText } from '../animate-text'
import { Chart } from '../chart'
import {
  Card,
  DataPanel,
  IconButton,
  LoadingIcon,
  Title,
  UnitText,
} from '../styled'
import { ValueText } from './value-text'

import type { Download, TestResult, Upload } from '@/interface'

// eslint-disable-next-line no-restricted-syntax
const enum Status {
  Completed = 'Completed',
  Connecting = 'Connecting',
  TestingDownload = 'TestingDownload',
  TestingUpload = 'TestingUpload',
  WaitingForResult = 'Waiting',
}

export const Result = () => {
  const [latestDownload, setLatestDownload] = useThrottleState<Download | null>(
    null,
  )
  const [latestUpload, setLatestUpload] = useThrottleState<Upload | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [unit] = useSelector((state) => state.unit)
  const [, setPage] = useSelector((state) => state.page)
  const [chartRef, { addDownloadData, addUploadData, clearData }] =
    useChartData()

  const [status, setStatus] = useState(Status.Connecting)

  const rerun = useSpeedtest({
    download(payload) {
      addDownloadData(payload)
      setLatestDownload(payload)
      setStatus(Status.TestingDownload)
    },
    result(payload) {
      setTestResult(payload)
      setStatus(Status.Completed)
    },
    upload(payload) {
      addUploadData(payload)
      setLatestUpload(payload)
      if (payload.upload.progress === 1) {
        setStatus(Status.WaitingForResult)
      } else {
        setStatus(Status.TestingUpload)
      }
    },
  })

  const retry = () => {
    setStatus(Status.Connecting)
    setLatestDownload(null)
    setLatestUpload(null)
    setTestResult(null)
    clearData()
    rerun()
  }

  useEffect(() => {
    switch (status) {
      case Status.Connecting:
      case Status.WaitingForResult:
        toast.custom(
          () => (
            <div className='flex items-center justify-center'>
              <span className='rounded-[14px] bg-white px-4 py-2 text-[10px] font-semibold text-gray-600 shadow-md dark:bg-zinc-800 dark:text-zinc-400'>
                {status}...
              </span>
            </div>
          ),
          {
            id: status,
            duration: Infinity,
            position: 'bottom-center',
          },
        )
        break
      case Status.Completed:
        toast.custom(
          () => (
            <div className='flex items-center justify-center gap-2'>
              <IconButton onClick={() => setPage(Page.Home)}>
                <IconArrowBackUp className='size-4' />
              </IconButton>
              <IconButton onClick={retry}>
                <IconReload className='size-4' />
              </IconButton>
            </div>
          ),
          {
            id: status,
            duration: Infinity,
            position: 'bottom-center',
          },
        )
    }

    return () => {
      toast.dismiss(status)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const isTestEnd = testResult !== null

  const downloadMean = roundOrDefault(
    testResult?.download.latency.iqm ?? latestDownload?.download.latency?.iqm,
  )
  const downloadSpeed = bandwidthConvertOrDefault(
    unit,
    testResult?.download.bandwidth ?? latestDownload?.download.bandwidth,
  )

  const uploadMean = roundOrDefault(
    testResult?.upload.latency.iqm ?? latestUpload?.upload.latency?.iqm,
  )
  const uploadSpeed = bandwidthConvertOrDefault(
    unit,
    testResult?.upload.bandwidth ?? latestUpload?.upload.bandwidth,
  )

  const isDownloadLoading = status === Status.TestingDownload
  const isUploadLoading = status === Status.TestingUpload

  const meanNode = <Title className='text-xs'>Mean</Title>
  const speedNode = <Title className='text-xs'>Speed</Title>

  return (
    <motion.div
      key='Result'
      animate={{ opacity: 1, y: 0 }}
      className='grid size-full grid-cols-2 grid-rows-[auto_1fr] gap-3'
      exit={{ opacity: 0, y: -50 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <Title className='mb-2 font-semibold'>
          Download {isDownloadLoading && <LoadingIcon />}
        </Title>
        <DataPanel>
          <div>
            {meanNode}
            <ValueText loading={!isTestEnd}>
              <AnimateText value={downloadMean} />
              <UnitText>ms</UnitText>
            </ValueText>
          </div>
          <div>
            {speedNode}
            <ValueText loading={!isTestEnd}>
              <AnimateText value={downloadSpeed} />
              <UnitText>{unit}</UnitText>
            </ValueText>
          </div>
        </DataPanel>
      </Card>
      <Card>
        <Title className='mb-2 font-semibold'>
          Upload {isUploadLoading && <LoadingIcon />}
        </Title>
        <DataPanel>
          <div>
            {meanNode}
            <ValueText loading={!isTestEnd}>
              <AnimateText value={uploadMean} />
              <UnitText>ms</UnitText>
            </ValueText>
          </div>
          <div>
            {speedNode}
            <ValueText loading={!isTestEnd}>
              <AnimateText value={uploadSpeed} />
              <UnitText>{unit}</UnitText>
            </ValueText>
          </div>
        </DataPanel>
      </Card>
      <Card className='col-span-2 overflow-clip p-0'>
        <Chart ref={chartRef} />
      </Card>
    </motion.div>
  )
}
