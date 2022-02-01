import Promise from 'bluebird';
import { create, exists } from '../../utils/file'
import fs from 'fs';
import exec from '../../exec.js';

const readFile = Promise.promisify(fs.readFile);

export const run = async ({ host, path, method }) => {
    if (method === 'apache') {
        try {
            await exec(`letsencrypt certonly -d ${host} --apache --quiet`);
        } catch (err) {
            throw new Error('Failed to create certificates using Apache Method')
        }
    } else if (method === 'dns') {
        try {
            console.log('test')
            let output = await exec(`certbot certonly --manual-public-ip-logging-ok --preferred-challenge=dns  --manual-auth-hook /home/vagrant/avanti/avanti-core/src/helper/dnsAcmeHook.js --cert-name jose122233.lu -d jose122233.lu --manual`);
            console.log('output', output)
            return;
            // certbot certonly --manual-public-ip-logging-ok --manual --preferred-challenge=dns --agree-tos -m jose@ion.lu --cert-name jose.iondev.lu -d jose.iondev.lu
        } catch (err) {
            console.log('err', err)
            throw new Error('Failed to create certificates using DNS Method')
        }
    }
    let lastmodifiedFolder = await getlastModifiedFolder(host)
    let letsEncryptCertsExist = await Promise.all([exists(`/etc/letsencrypt/live/${lastmodifiedFolder}/privkey.pem`), exists(`/etc/letsencrypt/live/${lastmodifiedFolder}/fullchain.pem`)])
    if (letsEncryptCertsExist.includes(false)) {
        throw new Error('CertBot Certs not created')
    } else {
        let fullchain = await readFile(`/etc/letsencrypt/live/${lastmodifiedFolder}/fullchain.pem`)
        let privkey = await readFile(`/etc/letsencrypt/live/${lastmodifiedFolder}/privkey.pem`)
        return Promise.all([create(path + '/certs/fullchain.pem', fullchain), create(path + '/certs/privkey.pem', privkey)])
    }
};

async function getlastModifiedFolder (domain) {
    let path = '/etc/letsencrypt/live'
    return fs.readdirSync(path).filter(function (file) {
        return file.startsWith(domain) && fs.statSync(path+'/'+file).isDirectory()
    }).reduce((last, current) => {
        let currentFileDate = new Date(fs.statSync(path+'/' + current).mtime);
        let lastFileDate = new Date(fs.statSync(path+'/' + last).mtime);
        return ( currentFileDate.getTime() > lastFileDate.getTime() ) ? current: last;
    })
}
