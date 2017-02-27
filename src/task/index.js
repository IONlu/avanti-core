import chalk from 'chalk';

export const run = async (name, args) => {
    process.stdout.write(chalk.blue('Task: ' + name + ' [run]\n'));
    try {
        var task = require('./' + name.replace(/\./g, '/'));
        await task.run(args);
    } catch (err) {
        process.stdout.write(chalk.red('Task: ' + name + ' [error]\n'));
        throw err;
    }
    process.stdout.write(chalk.green('Task: ' + name + ' [ok]\n'));
};
