import exec from '../exec.js';

const stop    = async () => exec('service php7.0-fpm stop');
const start   = async () => exec('service php7.0-fpm start');
const restart = async () => exec('service php7.0-fpm restart');

export default { stop, start, restart };
