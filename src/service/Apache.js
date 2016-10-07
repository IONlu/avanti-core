import exec from '../exec.js';

const stop       = async () => exec('service apache2 stop');
const start      = async () => exec('service apache2 start');
const restart    = async () => exec('service apache2 restart');
const testConfig = async () => exec('apachectl configtest');

export default { stop, start, restart, testConfig };
