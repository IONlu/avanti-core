import exec from '../../exec.js';

export const run = async () => {
    return exec('service php7.0-fpm start');
};
