import { Ffmpeg } from '../src/ffmpeg'

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
