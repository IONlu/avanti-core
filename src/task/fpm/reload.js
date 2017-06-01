import exec from '../../exec.js';
import * as PHP from '../../helper/php';

export const run = async ({ php } = {}) => {
    const versions = php
        ? [ php ]
        : await PHP.versions();
    return Promise.all(versions.map(async version => {
        try {
            return await exec('service {{service}} reload', {
                service: `php${version}-fpm`
            });
        } catch(err) {
            return await exec('service {{service}} restart', {
                service: `php${version}-fpm`
            });
        }
    }));
};
