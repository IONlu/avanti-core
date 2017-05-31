import exec from '../../exec.js';
import * as PHP from '../../helper/php';

export const run = async () => {
    const versions = await PHP.versions();
    return Promise.all(versions.map(version => {
        return exec('service {{service}} start', {
            service: `php${version}-fpm`
        });
    }));
};
