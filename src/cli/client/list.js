import Client from '../../client.js';
import chalk from 'chalk';
import { table } from 'table';

export const execute = async () => {
    try {
        var clients = await Client.list();
        var rows = clients.map(row => {
            return [
                row.client,
                row.user,
                row.path
            ];
        });
        var header = [
            'Client', 'User', 'Path'
        ].map(text => chalk.bold(text));
        process.stdout.write(table([ header, ...rows ]));
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
