const fs = require('fs')
const path = require('path')
const https = require('https')
const { execSync } = require('child_process')
const os = require('os')

const url = {
  macos:
    'https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-macosx-universal.tgz',
  windows:
    'https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-win64.zip',
  linux:
    'https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-linux-x86_64.tgz',
}

const getPlatform = () => {
  const platform = os.platform()
  switch (platform) {
    case 'darwin':
      return 'macos'
    case 'win32':
      return 'windows'
    case 'linux':
      return 'linux'
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        const totalSize = parseInt(response.headers['content-length'], 10)
        let downloadedSize = 0

        response.on('data', (chunk) => {
          downloadedSize += chunk.length
          const progress = (downloadedSize / totalSize) * 100
          process.stdout.write(
            `\rDownloading: ${progress.toFixed(1)}% [${downloadedSize}/${totalSize} bytes]`,
          )
        })

        response.pipe(file)
        file.on('finish', () => {
          process.stdout.write('\n')
          file.close()
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

const extract = (filePath, destDir) => {
  const platform = getPlatform()
  try {
    if (platform === 'windows') {
      ensureDir(destDir)
      execSync(
        `powershell -command "Expand-Archive -Path '${filePath}' -DestinationPath '${destDir}' -Force"`,
        { stdio: 'inherit' }
      )
    } else {
      execSync(`tar -xzf "${filePath}" -C "${destDir}"`, { stdio: 'inherit' })
    }
  } catch (error) {
    console.error('Extraction failed:', error)
    throw error
  }
}

const isDirEmpty = (dir) => {
  try {
    const files = fs.readdirSync(dir)
    return files.length === 0
  } catch (error) {
    return true
  }
}

async function main() {
  try {
    const platform = getPlatform()
    const downloadUrl = url[platform]
    const resourcesDir = path.join(__dirname, '../src-tauri/resources')
    const binDir = path.join(resourcesDir, 'bin')

    ensureDir(binDir)

    if (!isDirEmpty(binDir)) {
      console.log('Speedtest CLI already exists, skipping download...')
      return
    }

    const tempFile = path.join(
      os.tmpdir(), 
      `speedtest-${platform}${platform === 'windows' ? '.zip' : '.tgz'}`
    )

    console.log(`Downloading speedtest CLI for ${platform}...`)
    await download(downloadUrl, tempFile)

    console.log('Extracting...')
    extract(tempFile, binDir)

    try {
      fs.unlinkSync(tempFile)
    } catch (error) {
      console.warn('Warning: Failed to delete temporary file:', error)
    }

    console.log('Done!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
