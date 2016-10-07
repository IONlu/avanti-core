import Client from '../client.js';

const create = async (client) => {
    try {
        await (new Client(client)).create();
    } catch(e) {
        console.error(e);
    }
};

const remove = async (client) => {
    try {
        await (new Client(client)).remove();
    } catch(e) {
        console.error(e);
    }
};

export { create, remove };
