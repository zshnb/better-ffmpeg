import { beforeEach, describe, expect, it } from '@jest/globals'
import { Ffmpeg } from '../src/ffmpeg'

describe('video filter', () => {
  let ffmpeg: Ffmpeg
  beforeEach(() => {
    ffmpeg = new Ffmpeg()
  })
  it('success with filter', () => {
    ffmpeg
      .input()
      .file('tests/media/5s_vertical_1080p.mp4')
      .videoFilter()
      .raw('scale', { x: 400, y: 400 })
      .end()
      .output()
      .file('tests/output/5s_vertical_1080p.mp4')
    expect(ffmpeg.cmd).toBe(
      '-i tests/media/5s_vertical_1080p.mp4 -vf scale=x=400:y=400 tests/output/5s_vertical_1080p.mp4',
    )
  })
  it('success with addroi', () => {
    ffmpeg
      .input()
      .file('tests/media/5s_vertical_1080p.mp4')
      .videoFilter()
      .addroi({
        x: 100,
        y: 100,
        w: 100,
        h: 100,
      })
      .end()
      .output()
      .file('tests/output/5s_vertical_1080p.mp4')
    expect(ffmpeg.cmd).toBe(
      '-i tests/media/5s_vertical_1080p.mp4 -vf addroi=x=100:y=100:w=100:h=100 tests/output/5s_vertical_1080p.mp4',
    )
  })
})
