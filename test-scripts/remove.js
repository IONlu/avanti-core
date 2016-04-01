var Customer = require('../src/customer.js');

var customer = new Customer('customer');
customer.removeHost('customer.test');
customer.remove();
