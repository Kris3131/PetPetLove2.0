import { addColors, createLogger, format, transports } from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

addColors(colors);

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logTransports = [
  new transports.Console(),
  new transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new transports.File({ filename: 'logs/all.log' }),
];

const logger = createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports: logTransports,
});

export default logger;
