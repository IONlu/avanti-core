import Promise from 'bluebird';
import fs from 'fs';
import { Warning } from '../../../task';
import globby from 'globby';

const unlink = Promise.promisify(fs.unlink);

export const run = async ({ hostname }) => {
    const files = await globby(`/etc/php/*/fpm/pool.d/${hostname}.conf`);
    try {
        return Promise.all(files.map(file => unlink(file)));
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Warning(err.message);
        }
        throw err;
    }

};
