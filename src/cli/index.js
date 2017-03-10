import chalk from 'chalk';
import setup from '../setup';
import yargonaut from 'yargonaut';
import yargs from 'yargs';
import packageJson from '../../package.json';
import * as Client from './client';
import * as Host from './host';
import * as Task from './task';

const handleError = err => {
    process.exitCode = 1;
    process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + err) + '\n');
    process.exit();
};

const handleCommand = (handler, yargs) => {
    return async argv => {
        try {
            await handler.handle(argv, yargs);
        } catch(err) {
            handleError(err);
        }
        process.exit();
    };
};

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

            .command(Client.command, Client.description, Client.options, handleCommand(Client, yargs))
            .command(Host.command, Host.description, Host.options, handleCommand(Host, yargs))
            .command(Task.command, Task.description, Task.options, handleCommand(Task, yargs))

            .recommendCommands()
            .help()
            .argv;

        if (options._.length === 0) {
            yargs.showHelp();
            process.exit();
        }

    }, err => {
        throw err;
    });

} catch(err) {
    handleError(err);
}
