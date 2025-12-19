const winston = require("winston");
const LokiTransport = require("winston-loki");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    // Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(meta).length > 0) {
            msg += `\n${JSON.stringify(meta, null, 2)}`;
          }
          return msg;
        })
      )
    }),
    // Loki transport for centralized logging
    new LokiTransport({
      host: "http://192.168.0.108:3100",
      labels: { job: "nodejs-app" },
      json: true
    })
  ]
});

module.exports = logger;