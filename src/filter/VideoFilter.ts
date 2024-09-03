import { Ffmpeg } from '../ffmpeg'

export class VideoFilter {
  private readonly filters: string[]
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.filters = []
    this.ffmpeg = ffmpeg
  }

  rawStr(filter: string): VideoFilter {
    this.filters.push(filter)
    return this
  }

  raw(name: string, parameters: object): VideoFilter {
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
    this.filters.push('-vf')
  }

  end(): Ffmpeg {
    return this.ffmpeg
  }

  get filterParameters(): string[] {
    return this.filters
  }
}
