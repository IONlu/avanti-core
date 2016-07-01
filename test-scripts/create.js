import Customer from '../src/customer.js';

(async function() {
    try {
        var customer = new Customer('customer');
        await customer.create();
        await customer.addHost('customer.test');
    } catch(e) {
        console.error(e);
    }
})();
