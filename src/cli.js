import commander from 'commander';
import * as Customer from './cli/customer.js';

commander
    .version('0.1.0');

commander
    .command('customer <action> <customer>')
    .action(function(action, customer) {
        Customer[action](customer);
    });

commander
    .parse(process.argv);
