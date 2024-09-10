import { ComplexFilterLabel, Input, MediaTarget } from '../types/ffmpeg'
import * as fs from 'node:fs'
import { Ffmpeg } from './ffmpeg'
import { VideoFilter } from './filter/VideoFilter'

export class InputContext {
  private readonly inputs: Input[]
  private inputIndex: number
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.ffmpeg = ffmpeg
    this.inputs = []
    this.inputIndex = 0
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

  format(fmt: string): InputContext {
    this.inputs[this.inputIndex].options.push(...['-f', fmt])
    return this
  }

  streamLoop(value: number): InputContext {
    this.inputs[this.inputIndex].options.push(...['-stream_loop', value])
    return this
  }

  duration(value: string | number): InputContext {
    this.inputs[this.inputIndex].options.push(...['t', value])
    return this
  }

  seek(value: string): InputContext {
    this.inputs[this.inputIndex].options.push(...['ss', value])
    return this
  }

  seekNegative(value: string): InputContext {
    this.inputs[this.inputIndex].options.push(...['sseof', value])
    return this
  }

  iSync(index: number): InputContext {
    this.inputs[this.inputIndex].options.push(...['isync', index])
    return this
  }

  codec({
    target,
    value,
    streamSpecifier,
  }: {
    target: MediaTarget
    value: string
    streamSpecifier?: number
  }): InputContext {
    let param = target === 'video' ? '-c:v' : '-c:a'
    if (streamSpecifier !== undefined) {
      param += `:${streamSpecifier}`
    }
    this.inputs[this.inputIndex].options.push(...[param, value])
    return this
  }

  raw(str: string): InputContext {
    const array = str.split(' ', 1)
    this.inputs[this.inputIndex].options.push(...array)
    return this
  }

  end(): Ffmpeg {
    this.inputIndex += 1
    return this.ffmpeg
  }

  videoFilter(): VideoFilter<{}> {
    return this.ffmpeg.videoFilter()
  }

  complexFilter(): VideoFilter<ComplexFilterLabel> {
    return this.ffmpeg.complexFilter()
  }

  get inputParameters(): string[] {
    return this.inputs
      .map((input) => {
        return input.options
          .map((it) => it.toString())
          .concat(['-i', input.source])
      })
      .flat()
  }
}
