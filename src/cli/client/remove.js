import Client from '../../client.js';
import chalk from 'chalk';

export const execute = async (options) => {
    try {
        await (new Client(options.remove)).remove();
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
