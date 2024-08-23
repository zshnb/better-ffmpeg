import logger from './logger'
import { LogLevelSetting, ReportSetting, RunResult } from '../types/ffmpeg'
import { LogLevel } from './loglevel'
import { execFileSync, execSync, spawn } from 'node:child_process'
import { InputContext } from './inputContext'

export class Ffmpeg {
  private readonly ffmpegPath: string
  private readonly globalOptions: string[]
  private readonly inputContext: InputContext

  constructor(ffmpegPath?: string) {
    this.globalOptions = []
    this.inputContext = new InputContext(this)
    if (ffmpegPath) {
      this.checkFfmpegPathValid(ffmpegPath)
      this.ffmpegPath = ffmpegPath
    } else {
      this.ffmpegPath = this.findFfmpegPath()
      if (!this.ffmpegPath) {
        throw new Error('ffmpeg path not found')
      }
    }
  }

  override(): Ffmpeg {
    this.globalOptions.push('-y')
    return this
  }

  noOverride(): Ffmpeg {
    this.globalOptions.push('-n')
    return this
  }

  loglevel(setting?: LogLevelSetting): Ffmpeg {
    const { flags, level } = setting
    let params = ''
    if (flags) {
      params = `${flags.join('+')}+`
    }
    this.globalOptions.push(
      `-loglevel ${params}${LogLevel[level || LogLevel.INFO].toLowerCase()}`,
    )
    return this
  }

  report(setting?: ReportSetting): Ffmpeg {
    // todo read FFREPORT env
    const params = []
    if (setting?.file) {
      params.push(`file=${setting.file}`)
    }
    params.push(`level=${setting?.level || LogLevel.DEBUG}`)
    this.globalOptions.push(`-report ${params.join(':')}`)
    return this
  }

  hideBanner(): Ffmpeg {
    this.globalOptions.push('-hide_banner')
    return this
  }

  cpuFlags(flags: string): Ffmpeg {
    this.globalOptions.push(`-cpuflags ${flags}`)
    return this
  }

  cpuCount(count: number): Ffmpeg {
    this.globalOptions.push(`-cpucount ${count}`)
    return this
  }

  maxAlloc(bytes: number): Ffmpeg {
    this.globalOptions.push(`-max_alloc ${bytes}`)
    return this
  }

  run(): Promise<RunResult> {
    const childProcess = spawn(
      'ffmpeg',
      this.globalOptions.concat(this.inputContext.inputParameters),
    )
    let errorMessage = ''
    childProcess.stderr.on('data', (data) => {
      errorMessage += data.toString()
    })
    childProcess.stdout.on('data', () => {})

    function handleExit(code: number, resolve: (value: RunResult) => void) {
      if (code !== 0) {
        logger.error(`ffmpeg exited with code ${code}`)
        resolve({
          exitCode: code,
          error: new Error(errorMessage),
        })
      } else {
        resolve({
          exitCode: code,
        })
      }
    }
    return new Promise<RunResult>((resolve) => {
      childProcess.on('exit', (code) => handleExit(code, resolve))
      childProcess.on('error', (error) => {
        resolve({
          error,
          exitCode: -1,
        })
      })
      childProcess.on('close', (code) => handleExit(code, resolve))
    })
  }

  input(): InputContext {
    return this.inputContext
  }

  get cmd(): string {
    return `${this.globalOptionStr}${this.inputContext.inputParameters.join(' ')}`.trim()
  }

  get globalOptionStr(): string {
    return this.globalOptions.length === 0
      ? ''
      : this.globalOptions.join(' ') + ' '
  }

  private findFfmpegPath(): string | null {
    try {
      let command: string
      if (process.platform === 'win32') {
        command = 'where ffmpeg'
      } else {
        command = 'which ffmpeg'
      }
      return execSync(command).toString().trim()
    } catch (error) {
      logger.error(error, 'ffmpeg not found')
      return null
    }
  }

  private checkFfmpegPathValid(ffmpegPath: string) {
    try {
      execFileSync(ffmpegPath, ['-version'])
    } catch (e) {
      logger.error(e, `${ffmpegPath} is not a valid ffmpeg`)
      throw new Error(`${ffmpegPath} is not a valid ffmpeg`)
    }
  }
}
