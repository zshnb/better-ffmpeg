import { LogLevel } from '../src/loglevel'
import { Ffmpeg } from '../src/ffmpeg'

export type Flag = 'repeat' | 'level'
export type LogLevelSetting = {
  flags?: Flag[]
  level?: LogLevel
}
export type ReportSetting = {
  file?: string
  level?: LogLevel
}

export type Input = {
  source: string
  options: string[]
}

export type EventName = 'inputOptionEnd'

export interface InputContext {
  input(): InputContext

  file(path: string): OptionContext

  url(url: string | URL): OptionContext
}

export interface OptionContext {
  option(): MainInputOption & VideoInputOption & AudioInputOption
}

export interface InputOption {}

export interface MainInputOption extends InputOption {
  format(fmt: string): MainInputOption

  streamLoop(value: number): MainInputOption

  codec(stream: string): MainInputOption

  duration(value: string | number): MainInputOption

  seek(value: string): MainInputOption

  seekNegative(value: string): MainInputOption

  iSync(index: number): MainInputOption

  end(): Ffmpeg
}

export interface VideoInputOption extends InputOption {}

export interface AudioInputOption extends InputOption {}
