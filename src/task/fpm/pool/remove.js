import Promise from 'bluebird';
import fs from 'fs';
const unlink = Promise.promisify(fs.unlink);

export const run = async ({ hostname }) => {
    return await unlink(`/etc/php/7.0/fpm/pool.d/${hostname}.conf`);
};
