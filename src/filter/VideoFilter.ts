import { Ffmpeg } from '../ffmpeg'
import { Addroi } from '../../types/videoFilter'
import { ComplexFilterLabel } from '../../types/ffmpeg'
import { buildFilterParam, populateLabel } from '../util/filterUtil'

export class VideoFilter<T extends {} | ComplexFilterLabel> {
  private readonly filters: string[]
  private readonly ffmpeg: Ffmpeg

  constructor(ffmpeg: Ffmpeg) {
    this.filters = []
    this.ffmpeg = ffmpeg
  }

  rawStr(filter: string): VideoFilter<T> {
    this.filters.push(filter)
    return this
  }

  raw(name: string, parameters: object): VideoFilter<T> {
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

  addroi(param: Addroi & T): VideoFilter<T> {
    let str = `addroi=${buildFilterParam(param)}`
    str = populateLabel(str, param)
    this.filters.push(str)
    return this
  }

  end(): Ffmpeg {
    return this.ffmpeg
  }

  get filterParameters(): string[] {
    return this.filters
  }
}
