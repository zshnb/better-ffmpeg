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
