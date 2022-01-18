import Promise from 'bluebird';
import { create, exists } from '../../utils/file'
import fs from 'fs';
import exec from '../../exec.js';

const readFile = Promise.promisify(fs.readFile);

export const run = async ({ host, path, method }) => {
    if (method === 'apache') {
        try {
            await exec(`letsencrypt run -d ${host} --apache`);
        } catch (err) {
            throw new Error('Failed to create certificates using Apache Method')
        }
    } else if (method === 'dns') {
        try {
            await exec(`certbot certonly --manual-public-ip-logging-ok --preferred-challenge=dns --agree-tos -m jose@ion.lu --cert-name ${host} -d ${host} --manual`);
            // certbot certonly --manual-public-ip-logging-ok --manual --preferred-challenge=dns --agree-tos -m jose@ion.lu --cert-name jose.iondev.lu -d jose.iondev.lu
        } catch (err) {
            throw new Error('Failed to create certificates using DNS Method')
        }
    }
    let letsEncryptCertsExist = await Promise.all([exists(`/etc/letsencrypt/live/${host}/privkey.pem`), exists(`/etc/letsencrypt/live/${host}/fullchain.pem`)])
    if (letsEncryptCertsExist.includes(false)) {
        throw new Error('CertBot Certs not created')
    } else {
        let fullchain = await readFile(`/etc/letsencrypt/live/${host}/fullchain.pem`)
        let privkey = await readFile(`/etc/letsencrypt/live/${host}/privkey.pem`)
        return Promise.all([create(path + '/certs/fullchain.pem', fullchain), create(path + '/certs/privkey.pem', privkey)])
    }
};
