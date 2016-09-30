import commander from 'commander';
import * as Customer from './cli/customer.js';
import * as Host from './cli/host.js';

commander
    .version('0.1.0');

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
