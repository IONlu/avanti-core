import Promise from 'bluebird';
import {
    remove,
    exists
} from '../../utils/file'
import fs from 'fs';
import exec from '../../exec.js';

export const run = async ({
    host,
    path,
    method,
    hostAndAliases
}) => {
    if (method === 'apache') {
        try {
            await exec(`letsencrypt certonly -d ${hostAndAliases} --apache --quiet`);
        } catch (err) {
            throw new Error('Failed to create certificates using Apache Method')
        }
    } else if (method === 'dns') {
        try {
            let hookScript = __dirname + '/../../scripts/dnsAcmeHook.js'
            await exec(`certbot certonly --manual-public-ip-logging-ok --preferred-challenge=dns  --manual-auth-hook ${hookScript} -d ${hostAndAliases} --manual --quiet`, null, null, {
                ...process.env
            });
        } catch (err) {
            throw new Error('Failed to create certificates using DNS Method')
        }

    }
    let lastmodifiedFolder = await getlastModifiedFolder(host)
    let letsEncryptCertsExist = await Promise.all([exists(`/etc/letsencrypt/live/${lastmodifiedFolder}/privkey.pem`), exists(`/etc/letsencrypt/live/${lastmodifiedFolder}/fullchain.pem`)])
    if (letsEncryptCertsExist.includes(false)) {
        throw new Error('CertBot Certs not created')
    } else {
        let fullchain = `/etc/letsencrypt/live/${lastmodifiedFolder}/fullchain.pem`
        let privkey = `/etc/letsencrypt/live/${lastmodifiedFolder}/privkey.pem`
        await deleteFile(path + '/certs/privkey.pem')
        await deleteFile(path + '/certs/fullchain.pem')
        return Promise.all(
            [
                exec('ln -s {{source}} {{destination}}', {
                    source: privkey,
                    destination: path + '/certs/privkey.pem'
                }),
                exec('ln -s {{source}} {{destination}}', {
                    source: fullchain,
                    destination: path + '/certs/fullchain.pem'
                }),
            ])
    }
};

async function getlastModifiedFolder(domain) {
    let path = '/etc/letsencrypt/live'
    return fs.readdirSync(path).filter(function(file) {
        return file.startsWith(domain) && fs.statSync(path + '/' + file).isDirectory()
    }).reduce((last, current) => {
        let currentFileDate = new Date(fs.statSync(path + '/' + current).mtime);
        let lastFileDate = new Date(fs.statSync(path + '/' + last).mtime);
        return (currentFileDate.getTime() > lastFileDate.getTime()) ? current : last;
    })
}

async function deleteFile (filePath) {
    return await remove(filePath)
}
