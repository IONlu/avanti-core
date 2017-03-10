import chalk from 'chalk';

export class Warning extends Error {
    constructor(message) {
        super(message);
        this.name = 'TaskWarning';
    }
}

export const run = async (name, args) => {
    process.stdout.write(chalk.blue('Task: ' + name + ' [run]\n'));
    try {
        var task = require('./' + name.replace(/\./g, '/'));
        await task.run(args);
    } catch (err) {
        if (err instanceof Warning) {
            process.stdout.write(chalk.yellow('Task: ' + name + ' [warning] ' + err.message + '\n'));
            return;
        }
        process.stdout.write(chalk.red('Task: ' + name + ' [error] ' + err.message + '\n'));
        throw err;
    }
    process.stdout.write(chalk.green('Task: ' + name + ' [ok]\n'));
};
