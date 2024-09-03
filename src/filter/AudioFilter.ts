import { Ffmpeg } from '../ffmpeg'

export class AudioFilter {
  private readonly filters: string[]
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.filters = []
    this.ffmpeg = ffmpeg
  }

  rawStr(filter: string): AudioFilter {
    this.filters.push(filter)
    return this
  }

  raw(name: string, parameters: object): AudioFilter {
    const str = `${name}=`
    this.filters.push(
      str +
        Object.entries(parameters)
          .map(([key, value]) => {
            return `${key}=${value}`
          })
          .join(':'),
    )
    return this
  }

  start() {
    this.filters.push('-af')
  }

  end(): Ffmpeg {
    return this.ffmpeg
  }

  get filterParameters(): string[] {
    return this.filters
  }
}
