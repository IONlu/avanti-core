import Promise from 'bluebird';
import ini from 'ini';
import fs from 'fs';
import * as Fpm from './service/Fpm.js';

const writeFile = Promise.promisify(fs.writeFile);
const unlink    = Promise.promisify(fs.unlink);

async function createPoolFile(hostname, data) {
    await writeFile('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf', data);
}

async function removePoolFile(hostname) {
    await unlink('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf');
}

class Pool {
    constructor(host) {
        this.host = host;
    }

    async create() {
        const data = ini.encode({
            user: this.host.customer.name,
            group: this.host.customer.name,
            listen: '/run/php/' + this.host.name + '.sock',
            'listen.owner': 'www-data',
            'listen.group': 'www-data',
            pm: 'dynamic',
            'pm.max_children': 6,
            'pm.start_servers': 1,
            'pm.min_spare_servers': 1,
            'pm.max_spare_servers': 3,
            'php_admin_value[open_basedir]': '/var/www/' + this.host.customer.name + '/' + this.host.name
        }, {
            section: this.host.name
        });
        await createPoolFile(this.host.name, data);
        await Fpm.restart();
    }

    async remove() {
        await removePoolFile(this.host.name);
        await Fpm.restart();
    }
}

export default Pool;
