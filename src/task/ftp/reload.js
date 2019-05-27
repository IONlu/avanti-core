import exec from '../../exec.js';

export const run = async () => {
    return exec('service proftpd reload');
};
