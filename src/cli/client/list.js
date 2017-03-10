import Client from '../../client.js';
import chalk from 'chalk';
import pad from 'pad';

export const execute = async () => {
    try {
        var clients = await Client.all();
        var clientLength = clients.reduce((a, b) => Math.max(a, b.client.length), 0);
        var userLength   = clients.reduce((a, b) => Math.max(a, b.user.length), 0);
        process.stdout.write(clients.map(client => {
            return pad(client.client, clientLength)
                + '  ' + pad(client.user, userLength)
                + '  ' + client.path;
        }).join('\n') + '\n');
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
