import exec from '../exec.js';

export const stop       = async () => exec('service apache2 stop');
export const start      = async () => exec('service apache2 start');
export const restart    = async () => exec('service apache2 restart');
export const testConfig = async () => exec('apachectl configtest');
