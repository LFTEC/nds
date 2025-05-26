import {createLogger, format, transports} from "winston";
import {ElasticsearchTransport} from "winston-elasticsearch";

export const esTransport = new ElasticsearchTransport({
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || "https://localhost:9200",
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || "nes",
      password: process.env.ELASTICSEARCH_PASSWORD || "nes"
    }
  },
  indexPrefix: "nes-logs",
  indexSuffixPattern: "YYYY-MM",
  bufferLimit: 1000,
  flushInterval: 5000,
  retryLimit: 3,
});

esTransport.on("error", (error: Error)=>{
  console.error("Elasticsearch transport error:", error);
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
    format.errors({stack: true}),
    format.splat(),
    format.json(),
  ),
  defaultMeta: {service: "nes", nodeVersion: process.version},
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    esTransport
  ]
});

if(process.env.NODE_ENV !== "production") {globalForLogger.logger = logger}

export default logger;