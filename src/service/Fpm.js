import exec from '../exec.js';

export const stop       = async () => exec('service php7.0-fpm stop');
export const start      = async () => exec('service php7.0-fpm start');
export const restart    = async () => exec('service php7.0-fpm restart');
