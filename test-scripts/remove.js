import Customer from '../src/customer.js';

(async function() {
    try {
        var customer = new Customer('customer');
        await customer.removeHost('customer.test');
        await customer.remove();
    } catch(e) {
        console.error(e);
    }
})();
