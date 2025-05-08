import pino from 'pino';

// Function to create a logger instance with a name
export function getLogger(name) {
    return pino({
        name,
        level: process.env.PINO_LOG_LEVEL || 'debug',  // Default level
        // level: process.env.NEXT_PUBLIC_PINO_LOG_LEVEL,
        formatters: {
            level: (label) => {
                return { severity: label.toUpperCase() };
            }
        },
        timestamp: () => `,"time":"${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`
    });
}