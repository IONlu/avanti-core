import Promise from 'bluebird';
import fs from 'fs';
const unlink = Promise.promisify(fs.unlink);
import { Warning } from '../../../task';

export const run = async ({ hostname }) => {
    try {
        return await unlink(`/etc/apache2/sites-available/${hostname}.conf`);
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Warning(err.message);
        }
        throw err;
    }
};
