import exec from '../../exec.js';

export const run = async () => {
    return exec('service apache2 start');
};
