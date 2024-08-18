import { describe, expect, it } from '@jest/globals'
import { Ffmpeg } from '../src/ffmpeg'
import { LogLevel } from '../src/loglevel'

describe('ffmpeg class', () => {
  it('new success', () => {
    new Ffmpeg()
  })

  it('failed when wrong ffmpeg path', () => {
    expect(() => new Ffmpeg('/usr/bin/ls')).toThrow(Error)
  })

  it('set override', () => {
    const ffmpeg = new Ffmpeg().override()
    expect(ffmpeg.cmd).toBe('ffmpeg -y')
  })

  it('set log level', () => {
    let ffmpeg = new Ffmpeg().loglevel({
      level: LogLevel.ERROR,
    })
    expect(ffmpeg.cmd).toBe('ffmpeg -loglevel error')

    ffmpeg = new Ffmpeg().loglevel({
      flags: ['repeat'],
    })
    expect(ffmpeg.cmd).toBe('ffmpeg -loglevel repeat+info')

    ffmpeg = new Ffmpeg().loglevel({
      flags: ['repeat', 'level'],
      level: LogLevel.WARNING,
    })
    expect(ffmpeg.cmd).toBe('ffmpeg -loglevel repeat+level+warning')
  })

  it('set report', () => {
    let ffmpeg = new Ffmpeg().report()
    expect(ffmpeg.cmd).toBe('ffmpeg -report level=48')

    ffmpeg = new Ffmpeg().report({
      file: 'file.log',
      level: LogLevel.WARNING,
    })
    expect(ffmpeg.cmd).toBe('ffmpeg -report file=file.log:level=24')
  })

  it('hide banner', () => {
    const ffmpeg = new Ffmpeg().hideBanner()
    expect(ffmpeg.cmd).toBe('ffmpeg -hide_banner')
  })
})
