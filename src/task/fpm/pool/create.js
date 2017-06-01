import Promise from 'bluebird';
import fs from 'fs';
import * as Task from '../../../task';

const writeFile = Promise.promisify(fs.writeFile);

export const run = async ({ hostname, php, data }) => {
    await Task.run('fpm.pool.remove', { hostname });
    return writeFile(`/etc/php/${php}/fpm/pool.d/${hostname}.conf`, data);
};
