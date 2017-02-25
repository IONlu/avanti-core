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

            .command('client', 'client manager', {
                create: {
                    alias: 'c',
                    describe: 'client to create',
                    type: 'string'
                },
                remove: {
                    alias: 'r',
                    describe: 'client to remove',
                    type: 'string'
                }
            }, argv => {
                if (argv.create) {
                    Client.create(argv.create);
                    return;
                }

                if (argv.remove) {
                    Client.remove(argv.remove);
                    return;
                }
            })

            .command('host', 'host manager', {
                client: {
                    describe: 'client to use',
                    type: 'string',
                    demand: true
                },
                create: {
                    alias: 'c',
                    describe: 'host to create',
                    type: 'string'
                },
                remove: {
                    alias: 'r',
                    describe: 'host to remove',
                    type: 'string'
                }
            }, argv => {
                if (argv.create) {
                    Host.create(argv.client, argv.create);
                    return;
                }

                if (argv.remove) {
                    Host.create(argv.client, argv.remove);
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
