import winston from 'winston';
export default winston;

// Based on: https://github.com/winstonjs/winston/issues/228#issuecomment-114063636
const flush = transports => {
    return new Promise(resolve => {
        var numFlushes = 0;
        var numFlushed = 0;
        for (var key in transports) {
            if (transports[key]._stream) {
                numFlushes += 1;
                transports[key]._stream.once('finish', () => {
                    numFlushed += 1;
                    if (numFlushes === numFlushed) {
                        resolve();
                    }
                });
                transports[key]._stream.end();
            }
        }
        if (numFlushes === 0) {
            resolve();
        }
    });
};

winston.Logger.prototype.flush = function() {
    return flush(this.transports);
};
winston.flush = function() {
    return flush(this.default.transports);
};

winston.Logger.prototype.flushAndExit = winston.flushAndExit = function(code) {
    return this.flush().then(() => {
        process.exit(code);
    });
};

winston.Logger.prototype.logAndExit = winston.logAndExit = function() {
    const args = Array.from(arguments);
    const code = args.pop();
    this.log.apply(this, [
        ...args,
        () => {
            this.flush().then(() => {
                process.exit(code);
            });
        }
    ]);
};

export const init = async target => {
    winston.configure({
        levels: winston.config.syslog.levels,
        transports: [
            new winston.transports.File({
                filename: target + '/log/error.log',
                level: 'error'
            })
        ]
    });

    const handleError = err => {
        winston.logAndExit('error', err, 1);
    };

    process.on('unhandledRejection', handleError);
    process.on('uncaughtException', handleError);
};
