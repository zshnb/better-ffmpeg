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

export type RunResult = {
  error?: Error
  exitCode: number
}

export interface InputContext {
  input(): InputContext

  file(path: string): OptionContext

  url(url: string | URL): OptionContext
}

export interface OptionContext {
  option(): MainInputOption
  videoOption(): VideoInputOption
}

export interface InputOption {
  end(): Ffmpeg
}

export interface MainInputOption extends InputOption {
  format(fmt: string): MainInputOption

  streamLoop(value: number): MainInputOption

  duration(value: string | number): MainInputOption

  seek(value: string): MainInputOption

  seekNegative(value: string): MainInputOption

  iSync(index: number): MainInputOption
}

export interface VideoInputOption extends InputOption {
  codec({
    value,
    streamSpecifier,
  }: {
    value: string
    streamSpecifier?: number
  }): VideoInputOption
}

export interface AudioInputOption extends InputOption {}
