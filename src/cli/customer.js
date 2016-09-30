import Customer from '../../src/customer.js';

const create = async (customer) => {
    try {
        await (new Customer(customer)).create();
    } catch(e) {
        console.error(e);
    }
};

const remove = async (customer) => {
    try {
        await (new Customer(customer)).remove();
    } catch(e) {
        console.error(e);
    }
};

export { create, remove };
