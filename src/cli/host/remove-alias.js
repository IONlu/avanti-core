import Client from '../../client.js';
import Host from '../../host.js';
import chalk from 'chalk';

export const execute = async (options) => {
    if (!options.host) {
        process.exitCode = 1;
        process.stderr.write(chalk.red('Missing required argument: host') + '\n');
        return;
    }

    try {
        var host;
        if (options.client) {
            host = (await Client.get(options.client)).host(options.host);
        } else {
            host = await Host.get(options.host);
        }
        await host.removeAlias(options['create-alias']);
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
