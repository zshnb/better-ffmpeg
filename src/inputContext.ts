import { Input } from '../types/ffmpeg'
import * as fs from 'node:fs'
import { MainInputOption, VideoInputOption } from '../types/inputOption'
import {
  MainInputOptionProcessor,
  VideoInputOptionProcessor,
} from './processor/inputOptionProcessor'
import * as EventEmitter from 'node:events'
import { Ffmpeg } from './ffmpeg'
import { VideoFilter } from './filter/VideoFilter'

export class InputContext {
  private readonly inputs: Input[]
  private inputIndex: number
  private readonly inputOptionProcessor: MainInputOptionProcessor
  private readonly videoOptionProcessor: VideoInputOptionProcessor
  private readonly inputEventEmitter: EventEmitter
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.ffmpeg = ffmpeg
    this.inputs = []
    this.inputIndex = 0
    this.inputEventEmitter = new EventEmitter()
    this.inputOptionProcessor = new MainInputOptionProcessor(
      ffmpeg,
      this.inputEventEmitter,
    )
    this.videoOptionProcessor = new VideoInputOptionProcessor(
      ffmpeg,
      this.inputEventEmitter,
    )
    this.setupEventListeners()
  }

  file(path: string): InputContext {
    if (!fs.existsSync(path)) {
      throw new Error(`file: ${path} not exist`)
    }
    if (!fs.statSync(path).isFile()) {
      throw new Error(`file: ${path} is not a file`)
    }
    this.inputs[this.inputIndex] = { source: path, options: [] }
    return this
  }

  inputOption(): MainInputOption {
    return this.inputOptionProcessor
  }

  videoOption(): VideoInputOption {
    return this.videoOptionProcessor
  }

  videoFilter(): VideoFilter {
    return this.ffmpeg.videoFilter()
  }

  setupEventListeners() {
    this.inputEventEmitter.on('inputOptionEnd', (options: string[]) => {
      this.inputs[this.inputIndex].options = options
      this.inputIndex += 1
    })
  }

  get inputParameters(): string[] {
    return this.inputs
      .map((input) => {
        return input.options.flat().concat(['-i', input.source])
      })
      .flat()
  }
}
