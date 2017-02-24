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
            .errorsStyle('red.bold');

        var options = yargs
            .version(packageJson.version)

            .command('client <client>', 'client manager', {
                create: {
                    alias: 'c',
                    describe: 'create client',
                    type: 'boolean'
                },
                remove: {
                    alias: 'r',
                    describe: 'remove client',
                    type: 'boolean'
                }
            }, argv => {
                if (argv.create) {
                    Client.create(argv.client);
                    return;
                }

                if (argv.remove) {
                    Client.remove(argv.client);
                    return;
                }
            })

            .command('host <client> <hostname>', 'host manager', {
                create: {
                    alias: 'c',
                    describe: 'create host',
                    type: 'boolean'
                },
                remove: {
                    alias: 'r',
                    describe: 'remove host',
                    type: 'boolean'
                }
            }, argv => {
                if (argv.create) {
                    Host.create(argv.client, argv.hostname);
                    return;
                }

                if (argv.remove) {
                    Host.create(argv.client, argv.hostname);
                    return;
                }
            })

            .recommendCommands()
            .help()
            .showHelpOnFail(false, 'Specify --help for available options')
            .argv;

        if (options._.length === 0) {
            yargs.showHelp();
        }

    });

} catch(e) {

    process.exitCode = 1;
    process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');

}
