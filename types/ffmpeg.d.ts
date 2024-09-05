import { LogLevel } from '../src/loglevel'

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
  options: (string | number)[]
}

export type Output = {
  source: string
  options: (string | number)[]
}

export type EventName = 'inputOptionEnd'

export type RunResult = {
  error?: Error
  exitCode: number
}

export type MediaTarget = 'video' | 'audio'
