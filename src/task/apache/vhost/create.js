import Promise from 'bluebird';
import fs from 'fs';
const writeFile = Promise.promisify(fs.writeFile);

export const run = async ({ hostname, data }) => {
    await writeFile(`/etc/apache2/sites-available/${hostname}.conf`, data);
};
