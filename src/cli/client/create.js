import Client from '../../client.js';
import chalk from 'chalk';

export const execute = async (options) => {
    if (!options.client) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: client') + '\n');
        return;
    }

    try {
        await (new Client(options.client)).create();
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
