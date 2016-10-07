import Promise from 'bluebird';
import ini from 'ini';
import fs from 'fs';
import Fpm from './service/Fpm.js';

const writeFile = Promise.promisify(fs.writeFile);
const unlink    = Promise.promisify(fs.unlink);

const createPoolFile = async (hostname, data) => {
    await writeFile(`/etc/php/7.0/fpm/pool.d/${hostname}.conf`, data);
};

const removePoolFile = async (hostname) => {
    await unlink(`/etc/php/7.0/fpm/pool.d/${hostname}.conf`);
};

class Pool {
    constructor(host) {
        this.host = host;
    }

    async create() {
        const hostInfo = await this.host.info();

        const data = ini.encode({
            user: hostInfo.user,
            group: hostInfo.user,
            listen: `/run/php/${hostInfo.user}.sock`,
            'listen.owner': 'www-data',
            'listen.group': 'www-data',
            pm: 'dynamic',
            'pm.max_children': 6,
            'pm.start_servers': 1,
            'pm.min_spare_servers': 1,
            'pm.max_spare_servers': 3,
            'php_admin_value[open_basedir]': `${hostInfo.path}`,
            'php_admin_value[disable_functions]': 'exec,mail,passthru,popen,proc_open,show_source,shell,shell_exec,symlink,system,phpinfo',
            'php_admin_value[sendmail_path]': `/usr/sbin/sendmail -t -i -f webmaster@${this.host.name} `
        }, {
            section: this.host.name
        });
        await createPoolFile(this.host.name, data);
        await Fpm.restart();
    }

    async remove() {
        await removePoolFile(this.host.name);
        await Fpm.restart();
    }
}

export default Pool;
