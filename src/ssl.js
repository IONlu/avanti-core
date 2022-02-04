import Registry from './registry';
import { exists } from './utils/file'
import * as Task from './task';
import Host from './host.js';
import exec from './exec';
import Whois from './helper/whois';
const { getDomain } = require('tldts');

class Ssl {
    constructor(host) {
        this.host = host;
        this.db = Registry.get('Database');
    }

    async enable (method) {
        let hostInfo = await this.host.info();
        if (hostInfo.ssl === 0) {
            let allowedMethods = ['dns', 'apache', 'manual']
            await this.checkSslModEnabled()
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
                } else if (method === 'dns') {
                    await this.checkDomainNameServersMatchingAvanti(hostInfo)
                    await Task.run('ssl.create', {
                        ...hostInfo,
                        method
                    });
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
                } else if (method === 'apache') {
                    await this.checkDomainDNSRecords(hostInfo)
                    await this.checkApacheCertBotPluginInstalled()
                    await Task.run('ssl.create', {
                        ...hostInfo,
                        method
                    });
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
            } else {
                throw new Error('Unknown Method, read the manuals')
            }
        } else {
            throw new Error('SSL already enabled for ' + hostInfo.host)
        }
    }

    host(hostname) {
        return (new Host(this, hostname));
    }

    async disable () {
        await this.checkSslModEnabled()
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

    async checkSslModEnabled () {
        try {
            await exec("apachectl -t -D DUMP_MODULES | grep ssl_module | awk '{print $1}'");
            return true
        } catch (err) {
            if (err.code === 1) {
                throw new Task.Warning('SSL Module disabled in Apache2');
            }
            throw err;
        }
    }

    async checkDomainNameServersMatchingAvanti (host) {
        let whois = await this.getWhoisForDomain(this.getDomainOutOfHostname(host.host))
        if (whois && whois.nserver) {
            let promises = []
            let nameservers = whois.nserver.split(' ')
            nameservers.forEach((el) => {
                promises.push(this.getCurrentIPForDomain(el))
            })
            let getAvantiServerIPs = await this.getCurrentIPForDomain('avanti-dns.mbox.lu')
            return await Promise.all(promises).then((element) => {
                let nameserverips = [].concat.apply([], element)
                nameserverips.forEach((ip) => {
                    if (!getAvantiServerIPs.includes(ip)) {
                        throw new Task.Warning('DNS Check Error: Nameserver check failed');
                    }
                })
            })
        } else {
            throw new Task.Warning('DNS Check Error: Failed to get Nameservers of ' + host.host);
        }
    }

    async checkDomainDNSRecords (host) {
        let domains = [
            host.host,
            ...host.alias
        ]
        let whois = await this.getWhoisForDomain(this.getDomainOutOfHostname(host.host))
        let serverIp = await this.getAvantiServerIP()
        let promises = []
        domains.forEach((domain) => {
            promises.push(this.getCurrentIPForDomain(domain, whois.nserver.split(' ')[0]))
        })
        return await Promise.all(promises).then((element) => {
            element.forEach((ip, index) => {
                if (!ip.includes(serverIp)) {
                    throw new Task.Warning('DNS Check Error: IP Pointing to Domain Record not same as Server (check ' + domains[index] + ')');
                }
            })
        })
    }

    async getWhoisForDomain (domain) {
        try {
            return await Whois(domain)
        } catch (err) {
            throw new Task.Warning(err.message);
        }
    }

    getDomainOutOfHostname (domain) {

        return getDomain(domain)
    }

    async getCurrentIPForDomain (domain, nameserver) {
        try {
            let params = {
                domain
            }
            if (nameserver) {
                params.nameserver = '@' + nameserver
            } else {
                params.nameserver = ' '
            }
            return exec('dig {{domain}} {{nameserver}} +short', params).then((element) => {
                 return element.trim().split('\n')
            })
        } catch (err) {
            if (err.code === 1) {
                throw new Task.Warning('SSL Module disabled in Apache2');
            }
            throw err;
        }
    }

    async getAvantiServerIP () {
        return await exec("hostname -I | awk '{print $1}'").then((element) => {
             return element.replace(/(\r\n|\n|\r)/gm, "");
        })
    }

    async checkApacheCertBotPluginInstalled () {
        try {
            return await exec("dpkg -l | grep -E '^ii' | grep python3-certbot-apache")
        } catch (err) {
            if (err.code === 1) {
                throw new Task.Warning('Apache2 Module not installed  (phyton3-certbot-apache)');
            }
            throw err;
        }
    }
}


export default Ssl;
