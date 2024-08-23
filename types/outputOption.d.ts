import { Ffmpeg } from '../src/ffmpeg'

export interface OutputOption {
  end(): Ffmpeg
}

export interface MainOutputOption extends OutputOption {
  format(fmt: string): MainOutputOption

  fs(value: number): MainOutputOption

  duration(value: string | number): MainOutputOption
}

export interface VideoOutputOption extends OutputOption {
  codec({
    value,
    streamSpecifier,
  }: {
    value: string
    streamSpecifier?: number
  }): VideoOutputOption
}

export interface AudioOutputOption extends OutputOption {}
