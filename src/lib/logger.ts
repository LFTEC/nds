import {createLogger, format, transports} from "winston";

const logger = createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? 'info': 'debug'),
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.colorize(),
    format.errors({stack: true}),
    format.splat(),
    format.json(),
  ),
  defaultMeta: {service: "nds"},
  transports: [
    new transports.Console()
  ]
})

export default logger;