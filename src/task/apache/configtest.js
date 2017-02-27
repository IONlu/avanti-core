import exec from '../../exec.js';

export const run = async () => {
    return exec('apachectl configtest');
};
