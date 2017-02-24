import chalk from 'chalk';
import setup from './setup.js';
import yargonaut from 'yargonaut';
import yargs from 'yargs';
import packageJson from '../package.json';
import * as Client from './cli/client.js';
import * as Host from './cli/host.js';

try {

    if (process.getuid() !== 0) {
        throw 'Avanti needs root privileges';
    }

    setup('/opt/avanti').then(() => {
        yargonaut
            .style('blue')
            .helpStyle('green')
            .errorsStyle('red');

        yargs
            .version(packageJson.version)
            .command('client <client>', 'client manager', {
                create: {
                    alias: 'c',
                    describe: 'create client'
                },
                remove: {
                    alias: 'r',
                    describe: 'remove client'
                }
            })
            .help()
            .argv;

        /*commander
            .command('create-client <client>')
            .action(function(client) {
                Client['create'](client);
            });

        commander
            .command('create-host <client> <hostname>')
            .action(function(client, hostname) {
                Host['create'](client, hostname);
            });

        commander
            .command('remove-client <client>')
            .action(function(client) {
                Client['remove'](client);
            });

        commander
            .command('remove-host <client> <hostname>')
            .action(function(client, hostname) {
                Host['remove'](client, hostname);
            });

        commander
            .parse(process.argv);*/

    });

} catch(e) {

    process.exitCode = 1;
    process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');

}
