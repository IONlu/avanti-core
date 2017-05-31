import Promise from 'bluebird';
import fs from 'fs';
const writeFile = Promise.promisify(fs.writeFile);

export const run = async ({ hostname, php, data }) => {
    return writeFile(`/etc/php/${php}/fpm/pool.d/${hostname}.conf`, data);
};
