import Registry from './registry';
import { exists } from './utils/file'
import * as Task from './task';
import Host from './host.js';

class Ssl {
    constructor(host) {
        this.host = host;
        this.db = Registry.get('Database');
    }

    async create (method) {
        let hostInfo = await this.host.info();
        if (hostInfo.ssl === 0) {
            let allowedMethods = ['auto', 'manual']
            if (allowedMethods.includes(method)) {
                if (method === 'manual') {
                    let checkCerts = await this.checkCertsExist(hostInfo.path)
                    if (checkCerts.includes(false)) {
                        throw new Error('SSL Certs missing')
                    } else {
                        await this.db
                        .table('host')
                        .where({
                            client: this.host.client.name,
                            host: this.host.name
                        })
                        .update({
                            ssl: 1
                        });
                        await this.host.refresh(this);
                    }
                } else if (method === 'auto') {
                    await Task.run('ssl.create', hostInfo);
                    await this.db
                    .table('host')
                    .where({
                        client: this.host.client.name,
                        host: this.host.name
                    })
                    .update({
                        ssl: 1
                    });
                    await this.host.refresh(this);
                }
            }
        } else {
            throw new Error('SSL already enabled for ' + hostInfo.host)
        }
    }

    host(hostname) {
        return (new Host(this, hostname));
    }

    async remove () {
        await this.db
            .table('host')
            .where({
                client: this.host.client.name,
                host: this.host.name
            })
            .update({
                ssl: 0
            });
            await this.host.refresh(this);
    }

    async checkCertsExist (path) {
        return Promise.all([exists(path + '/certs/fullchain.pem'), exists(path + '/certs/privkey.pem')])
    }
}


export default Ssl;
