import setup from './setup.js';
import commander from 'commander';
import packageJson from '../package.json';
import * as Customer from './cli/customer.js';
import * as Host from './cli/host.js';

setup().then(() => {

    commander
        .version(packageJson.version);

    commander
        .command('customer <action> <customer>')
        .action(function(action, customer) {
            Customer[action](customer);
        });

    commander
        .command('host <action> <customer> <hostname>')
        .action(function(action, customer, hostname) {
            Host[action](customer, hostname);
        });

    commander
        .parse(process.argv);

});
