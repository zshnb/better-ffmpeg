import { ComplexFilterLabel } from '../../types/ffmpeg'

export function buildFilterParam(param: object): string {
  return Object.entries(param)
    .filter(([key]) => !['in', 'out'].includes(key))
    .map(([key, value]) => {
      return `${key}=${value}`
    })
    .join(':')
}

export function populateLabel(
  param: string,
  label: object | ComplexFilterLabel,
) {
  let filter = param
  if ('in' in label) {
    filter = `[${label.in}]${filter}`
  }
  if ('out' in label) {
    filter = `${filter}[${label.out}]`
  }
  return filter
}
