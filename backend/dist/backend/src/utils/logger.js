/**
 * Simple logger utility with log levels.
 * Can be extended to integrate with external logging services.
 */
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
const currentLogLevel = process.env.LOG_LEVEL || 'info';
function shouldLog(level) {
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}
function formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
}
export const logger = {
    debug(message, ...args) {
        if (shouldLog('debug')) {
            console.debug(formatMessage('debug', message, ...args), ...args);
        }
    },
    info(message, ...args) {
        if (shouldLog('info')) {
            console.info(formatMessage('info', message, ...args), ...args);
        }
    },
    warn(message, ...args) {
        if (shouldLog('warn')) {
            console.warn(formatMessage('warn', message, ...args), ...args);
        }
    },
    error(message, error, ...args) {
        if (shouldLog('error')) {
            console.error(formatMessage('error', message, ...args), ...args);
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                });
            }
        }
    },
};
//# sourceMappingURL=logger.js.map