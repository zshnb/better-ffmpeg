import pino from 'pino'
import '@dotenvx/dotenvx'

const transport =
  process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
      }
    : undefined
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

export default logger
