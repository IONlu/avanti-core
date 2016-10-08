#!/usr/bin/env node
import clc from 'cli-color';
import setup from './setup.js';
import commander from 'commander';
import packageJson from '../package.json';
import * as Client from './cli/client.js';
import * as Host from './cli/host.js';

if (process.getuid() !== 0) {

    console.log(clc.red(clc.bold('ERROR:') + ' Avanti needs root privileges'));

} else {

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

}
