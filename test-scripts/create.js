var Customer = require('../src/customer.js');

var customer = new Customer('customer');
customer.create();
customer.addHost('customer.test');
