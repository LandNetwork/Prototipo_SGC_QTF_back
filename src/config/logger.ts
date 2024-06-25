import pino from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname'
});

const logger = pino({
    level: 'info'
}, stream);

export default logger;