import { Ffmpeg } from '../ffmpeg'
import { Addroi } from '../../types/videoFilter'

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

  addroi(param: Addroi): VideoFilter {
    const str = 'addroi='
    this.filters.push(
      str +
        Object.entries(param)
          .map(([key, value]) => {
            return `${key}=${value}`
          })
          .join(':'),
    )
    return this
  }

  end(): Ffmpeg {
    return this.ffmpeg
  }

  get filterParameters(): string[] {
    return this.filters
  }
}
