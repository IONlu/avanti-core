import Registry from './registry';
import { exists } from './utils/file'
import * as Task from './task';
import Host from './host.js';
import exec from './exec';

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
                        let certsEqual = await this.checkCertsEqual(hostInfo.path)
                        if (certsEqual) {
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
                        } else {
                            throw new Error('SSL Certs not Equal')
                        }

                    }
                } else if (method === 'auto') {
                    await Task.run('ssl.create', hostInfo);
                    let certsEqual = await this.checkCertsEqual(hostInfo.path)
                    if (certsEqual) {
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
                    } else {
                        throw new Error('SSL Certs not Equal')
                    }
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

    async checkCertsEqual (path) {
        try {
            let privateKeyFile = path + '/certs/privkey.pem'
            let publicKeyFile = path + '/certs/fullchain.pem'
            let privateKeyCheckSum = await exec(`openssl rsa --modulus --noout --in ${privateKeyFile} | openssl sha256`);
            let publicKeyCheckSum = await exec('openssl x509 -noout -modulus -in {{publicKeyFile}} | openssl sha256', { publicKeyFile });
            privateKeyCheckSum = privateKeyCheckSum.replace(/(\r\n|\n|\r)/gm, "").replace('(stdin)= ', '');
            publicKeyCheckSum = publicKeyCheckSum.replace(/(\r\n|\n|\r)/gm, "").replace('(stdin)= ', '');
            if (privateKeyCheckSum === publicKeyCheckSum) {
                return true
            } else {
                return false
            }
        } catch (err) {
            if (err.code === 1) {
                throw new Task.Warning(err.message);
            }
            throw err;
        }
    }
}


export default Ssl;
