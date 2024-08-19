import {
  AudioInputOption,
  EventName,
  InputOption,
  MainInputOption,
  VideoInputOption,
} from '../types/ffmpeg'
import { Ffmpeg } from './ffmpeg'
import * as EventEmitter from 'node:events'

export class InputOptionProcessor implements InputOption {
  protected options: string[]
  protected readonly ffmpeg: Ffmpeg
  protected readonly eventEmitter: EventEmitter

  constructor(ffmpeg: Ffmpeg, eventEmitter: EventEmitter) {
    this.options = []
    this.ffmpeg = ffmpeg
    this.eventEmitter = eventEmitter
  }

  end(): Ffmpeg {
    this.eventEmitter.emit<EventName>('inputOptionEnd', this.options)
    this.options = []
    return this.ffmpeg
  }
}

export class MainInputOptionProcessor
  extends InputOptionProcessor
  implements MainInputOption, AudioInputOption
{
  constructor(ffmpeg: Ffmpeg, eventEmitter: EventEmitter) {
    super(ffmpeg, eventEmitter)
  }

  format(fmt: string): MainInputOption {
    this.options.push(`-f ${fmt}`)
    return this
  }

  streamLoop(value: number): MainInputOption {
    this.options.push(`-stream_loop ${value}`)
    return this
  }

  duration(value: string | number): MainInputOption {
    this.options.push(`-t ${value}`)
    return this
  }

  seek(value: string): MainInputOption {
    this.options.push(`-ss ${value}`)
    return this
  }

  seekNegative(value: string): MainInputOption {
    this.options.push(`-sseof ${value}`)
    return this
  }

  iSync(index: number): MainInputOption {
    this.options.push(`-isync ${index}`)
    return this
  }
}

export class VideoInputOptionProcessor
  extends InputOptionProcessor
  implements VideoInputOption
{
  constructor(ffmpeg: Ffmpeg, eventEmitter: EventEmitter) {
    super(ffmpeg, eventEmitter)
  }

  codec({
    value,
    streamSpecifier,
  }: {
    value: string
    streamSpecifier?: number
  }): VideoInputOption {
    let param = '-c:v'
    if (streamSpecifier !== undefined) {
      param += `:${streamSpecifier}`
    }
    param += ` ${value}`
    this.options.push(param)
    return this
  }
}
