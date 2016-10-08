#!/usr/bin/env node
import chalk from 'chalk';
import setup from './setup.js';
import commander from 'commander';
import packageJson from '../package.json';
import * as Client from './cli/client.js';
import * as Host from './cli/host.js';

try {

    if (process.getuid() !== 0) {
        throw 'Avanti needs root privileges';
    }

    setup().then(() => {

        commander
            .version(packageJson.version);

        commander
            .command('client <action> <client>')
            .action(function(action, client) {
                Client[action](client);
            });

        commander
            .command('host <action> <client> <hostname>')
            .action(function(action, client, hostname) {
                Host[action](client, hostname);
            });

        commander
            .parse(process.argv);

    });

} catch(e) {

    console.log(chalk.red(chalk.bold('ERROR:') + ' ' + e));
    process.exitCode = 1;
    
}
