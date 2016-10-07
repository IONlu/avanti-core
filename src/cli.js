#!/usr/bin/env node

if (process.getuid() !== 0) {
    throw 'You need root privileges to use avanti';
}

import setup from './setup.js';
import commander from 'commander';
import packageJson from '../package.json';
import * as Client from './cli/client.js';
import * as Host from './cli/host.js';

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
