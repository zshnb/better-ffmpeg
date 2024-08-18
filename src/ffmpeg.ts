import { execFileSync, execSync } from 'child_process'
import logger from './logger'
import { LogLevelSetting, ReportSetting } from '../types/ffmpeg'
import { LogLevel } from './loglevel'

export class Ffmpeg {
  private readonly ffmpegPath: string
  private readonly globalOptions: string[]

  constructor(ffmpegPath?: string) {
    this.globalOptions = []
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

  get cmd(): string {
    return `ffmpeg ${this.globalOptions.join(' ')}`
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
