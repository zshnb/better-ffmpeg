import { MediaTarget, Output } from '../types/ffmpeg'
import { Ffmpeg } from './ffmpeg'

export class OutputContext {
  private readonly outputs: Output[]
  private outputIndex: number
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.outputs = []
    this.outputIndex = 0
    this.ffmpeg = ffmpeg
  }

  file(path: string): OutputContext {
    this.outputs[this.outputIndex] = { source: path, options: [] }
    return this
  }

  format(fmt: string): OutputContext {
    this.outputs[this.outputIndex].options.push(...['-f', fmt])
    return this
  }

  duration(value: string | number): OutputContext {
    this.outputs[this.outputIndex].options.push(...['-t', value])
    return this
  }

  fs(value: number): OutputContext {
    this.outputs[this.outputIndex].options.push(...['-fs', value])
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
  }): OutputContext {
    let param = target === 'video' ? '-c:v' : '-c:a'
    if (streamSpecifier !== undefined) {
      param += `:${streamSpecifier}`
    }
    this.outputs[this.outputIndex].options.push(...[param, value])
    return this
  }

  get outputParameters(): string[] {
    return this.outputs
      .map((output) => {
        return output.options.map((it) => it.toString()).concat([output.source])
      })
      .flat()
  }

  end(): Ffmpeg {
    this.outputIndex += 1
    return this.ffmpeg
  }
}
