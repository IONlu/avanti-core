import Client from '../client.js';

const create = async (client, hostname) => {
    try {
        await (new Client(client)).addHost(hostname);
    } catch(e) {
        console.error(e);
    }
};

const remove = async (client, hostname) => {
    try {
        await (new Client(client)).removeHost(hostname);
    } catch(e) {
        console.error(e);
    }
};

export { create, remove };
