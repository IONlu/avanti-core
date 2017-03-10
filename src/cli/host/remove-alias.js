import Client from '../../client.js';
import Host from '../../host.js';
import chalk from 'chalk';

export const execute = async (options) => {
    if (!options.host) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: host') + '\n');
        return;
    }

    if (!options.client) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: client') + '\n');
        return;
    }

    try {
        await (new Host(new Client(options.client), options.host)).removeAlias(options['remove-alias']);
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
