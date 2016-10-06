import Customer from '../customer.js';

const create = async (customer, hostname) => {
    try {
        await (new Customer(customer)).addHost(hostname);
    } catch(e) {
        console.error(e);
    }
};

const remove = async (customer, hostname) => {
    try {
        await (new Customer(customer)).removeHost(hostname);
    } catch(e) {
        console.error(e);
    }
};

export { create, remove };
