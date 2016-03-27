var Customer = require('../src/customer.js');

var customer = new Customer('customer');
customer.removeVhost('customer.test');
customer.remove();
