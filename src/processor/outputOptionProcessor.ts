import { EventName } from '../../types/ffmpeg'
import { Ffmpeg } from '../ffmpeg'
import * as EventEmitter from 'node:events'
import { VideoInputOption } from '../../types/inputOption'
import { MainOutputOption, OutputOption } from '../../types/outputOption'

export class OutputOptionProcessor implements OutputOption {
  protected options: (string | number)[][]
  protected readonly ffmpeg: Ffmpeg
  protected readonly eventEmitter: EventEmitter

  constructor(ffmpeg: Ffmpeg, eventEmitter: EventEmitter) {
    this.options = []
    this.ffmpeg = ffmpeg
    this.eventEmitter = eventEmitter
  }

  end(): Ffmpeg {
    this.eventEmitter.emit<EventName>('outputOptionEnd', this.options)
    this.options = []
    return this.ffmpeg
  }
}

export class MainOutputOptionProcessor
  extends OutputOptionProcessor
  implements MainOutputOption
{
  constructor(ffmpeg: Ffmpeg, eventEmitter: EventEmitter) {
    super(ffmpeg, eventEmitter)
  }

  format(fmt: string): MainOutputOption {
    this.options.push(['-f', fmt])
    return this
  }

  duration(value: string | number): MainOutputOption {
    this.options.push(['-t', value])
    return this
  }

  fs(value: number): MainOutputOption {
    this.options.push(['-fs', value])
    return this
  }
}

export class VideoOutputOptionProcessor
  extends OutputOptionProcessor
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
    this.options.push([param, value])
    return this
  }
}
