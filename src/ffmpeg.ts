import logger from './logger'
import {
  AudioInputOption,
  Input,
  InputContext,
  LogLevelSetting,
  MainInputOption,
  OptionContext,
  ReportSetting,
  VideoInputOption,
} from '../types/ffmpeg'
import { LogLevel } from './loglevel'
import { execFileSync, execSync } from 'node:child_process'
import * as fs from 'node:fs'
import { InputOptionProcessor } from './inputOptionProcessor'
import * as EventEmitter from 'node:events'

export class Ffmpeg implements InputContext {
  private readonly ffmpegPath: string
  private readonly globalOptions: string[]
  private readonly inputOptionProcessor: InputOptionProcessor
  private readonly inputs: Input[]
  private readonly inputEventEmitter: EventEmitter
  private inputIndex: number

  constructor(ffmpegPath?: string) {
    this.globalOptions = []
    this.inputs = []
    this.inputIndex = -1
    this.inputEventEmitter = new EventEmitter()
    this.inputOptionProcessor = new InputOptionProcessor(
      this,
      this.inputEventEmitter,
    )
    this.setupEventListeners()
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

  input(): InputContext {
    this.inputs.push({ source: '', options: [] })
    this.inputIndex++
    return this
  }

  file(path: string): OptionContext {
    if (!fs.existsSync(path)) {
      throw new Error(`file: ${path} not exist`)
    }
    if (!fs.statSync(path).isFile()) {
      throw new Error(`file: ${path} is not a file`)
    }
    this.inputs[this.inputIndex].source = path
    return this
  }

  option(): MainInputOption & VideoInputOption & AudioInputOption {
    return this.inputOptionProcessor
  }

  url(url: string | URL): OptionContext {
    this.inputs[this.inputIndex].source = url.toString()
    return this
  }

  get cmd(): string {
    const inputs = this.inputs
      .map((input) => {
        return `${input.options.join(' ')} -i ${input.source}`
      })
      .join(' ')
    return `ffmpeg ${this.globalOptionStr}${inputs}`
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

  setupEventListeners() {
    this.inputEventEmitter.on('inputOptionEnd', (options: string[]) => {
      this.inputs[this.inputIndex].options = options
    })
  }
}
