import Promise from 'bluebird';
import fs from 'fs';
const writeFile = Promise.promisify(fs.writeFile);

export const run = async ({ hostname, data }) => {
    return writeFile(`/etc/php/7.0/fpm/pool.d/${hostname}.conf`, data);
};
