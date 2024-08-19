import { LogLevel } from '../src/loglevel'
import { MainInputOption, VideoInputOption } from './inputOption'
import { MainOutputOption, VideoOutputOption } from './outputOption'

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
  file(path: string): InputOptionContext
  url(url: string | URL): InputOptionContext
}

export interface OutputContext {
  output(): OutputContext
  file(path: string): OutputOptionContext
}

export interface InputOptionContext {
  inputOption(): MainInputOption
  videoOption(): VideoInputOption
}

export interface OutputOptionContext {
  outputOption(): MainOutputOption
  videoOption(): VideoOutputOption
}
