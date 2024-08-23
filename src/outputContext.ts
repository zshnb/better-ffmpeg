import { Output } from '../types/ffmpeg'
import * as EventEmitter from 'node:events'
import { Ffmpeg } from './ffmpeg'
import {
  MainOutputOptionProcessor,
  VideoOutputOptionProcessor,
} from './processor/outputOptionProcessor'
import { MainOutputOption, VideoOutputOption } from '../types/outputOption'

export class OutputContext {
  private readonly outputs: Output[]
  private outputIndex: number
  private readonly mainOutputOptionProcessor: MainOutputOptionProcessor
  private readonly videoOutputOptionProcessor: VideoOutputOptionProcessor
  private readonly inputEventEmitter: EventEmitter
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.ffmpeg = ffmpeg
    this.outputs = []
    this.outputIndex = 0
    this.inputEventEmitter = new EventEmitter()
    this.mainOutputOptionProcessor = new MainOutputOptionProcessor(
      ffmpeg,
      this.inputEventEmitter,
    )
    this.videoOutputOptionProcessor = new VideoOutputOptionProcessor(
      ffmpeg,
      this.inputEventEmitter,
    )
    this.setupEventListeners()
  }

  file(path: string): OutputContext {
    this.outputs[this.outputIndex] = { source: path, options: [] }
    return this
  }

  outputOption(): MainOutputOption {
    return this.mainOutputOptionProcessor
  }

  videoOption(): VideoOutputOption {
    return this.videoOutputOptionProcessor
  }

  setupEventListeners() {
    this.inputEventEmitter.on('outputOptionEnd', (options: string[]) => {
      this.outputs[this.outputIndex].options = options
      this.outputIndex += 1
    })
  }

  get outputParameters(): string[] {
    return this.outputs
      .map((output) => {
        return output.options.flat().concat([output.source])
      })
      .flat()
  }
}
