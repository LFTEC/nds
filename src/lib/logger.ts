import {createLogger, format, transports} from "winston";
import {ElasticsearchTransport} from "winston-elasticsearch";
import {Client} from "@elastic/elasticsearch";

const esClient = new Client({
  node: "https://es.jcdev.cc:30141",
  auth: {
    username: "elastic",
    password: "elastic"
  },
});

const esTransport = new ElasticsearchTransport({
  client: esClient,
  indexPrefix: "nes-logs",
  indexSuffixPattern: "YYYY-MM",
  bufferLimit: 1000,
  flushInterval: 5000,
  retryLimit: 3
});

const globalForLogger = global as unknown as {
  logger: ReturnType<typeof createLogger>
}

const logger = globalForLogger.logger || createLogger({
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
  defaultMeta: {service: "nes"},
  transports: [
    new transports.Console(),
    esTransport
  ]
});

if(process.env.NODE_ENV !== "production") {globalForLogger.logger = logger}

export default logger;