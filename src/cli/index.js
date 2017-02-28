import chalk from 'chalk';
import setup from '../setup';
import yargonaut from 'yargonaut';
import yargs from 'yargs';
import packageJson from '../../package.json';
import * as Client from './client';
import * as Host from './host';
import * as Task from './task';

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

            .command(Client.command, Client.description, Client.options, argv => Client.handle(argv, yargs))
            .command(Host.command, Host.description, Host.options, argv => Host.handle(argv, yargs))
            .command(Task.command, Task.description, Task.options, argv => Task.handle(argv, yargs))

            .recommendCommands()
            .help()
            .argv;

        if (options._.length === 0) {
            yargs.showHelp();
        }

    });

} catch(e) {

    process.exitCode = 1;
    process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');

}
