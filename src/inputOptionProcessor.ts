import {
  AudioInputOption,
  EventName,
  MainInputOption,
  VideoInputOption,
} from '../types/ffmpeg'
import { Ffmpeg } from './ffmpeg'
import * as EventEmitter from 'node:events'

export class InputOptionProcessor
  implements MainInputOption, VideoInputOption, AudioInputOption
{
  private options: string[]
  private readonly ffmpeg: Ffmpeg
  private readonly eventEmitter: EventEmitter
  constructor(ffmpeg: Ffmpeg, eventEmitter: EventEmitter) {
    this.options = []
    this.ffmpeg = ffmpeg
    this.eventEmitter = eventEmitter
  }

  format(fmt: string): MainInputOption {
    this.options.push(`-f ${fmt}`)
    return this
  }
  streamLoop(value: number): MainInputOption {
    this.options.push(`-stream_loop ${value}`)
    return this
  }

  codec(stream: string): MainInputOption {
    this.options.push(`-codec ${stream}`)
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

  end(): Ffmpeg {
    this.eventEmitter.emit<EventName>('inputOptionEnd', this.options)
    this.options = []
    return this.ffmpeg
  }
}
