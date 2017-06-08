import winston from 'winston';

// init task logger
export const logger = new winston.Logger({
    levels: {
        error: 0,
        warning: 1,
        done: 2,
        run: 3
    },
    colors: {
        error: 'red',
        warning: 'yellow',
        done: 'green',
        run: 'blue'
    }
});

export class Warning extends Error {
    constructor(message) {
        super(message);
        this.name = 'TaskWarning';
    }
}

export const run = async (name, args) => {
    logger.run(name);
    try {
        var task = require('./' + name.replace(/\./g, '/'));
        await task.run(args);
    } catch (err) {
        if (err instanceof Warning) {
            logger.warning('%s :: %s', name, err.message);
            return;
        }
        logger.error('%s :: %s', name, err.message);
        throw err;
    }
    logger.done(name);
};
