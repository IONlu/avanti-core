import Promise from 'bluebird';
import ini from 'ini';
import fs from 'fs';
import * as Task from './task';

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
            'catch_workers_output': 'yes',
            'php_admin_value[open_basedir]': `${hostInfo.path}`,
            'php_admin_value[session.save_path]': `${hostInfo.path}/sessions`,
            'php_admin_value[disable_functions]': 'exec,mail,passthru,popen,proc_open,show_source,shell,shell_exec,symlink,system,phpinfo',
            'php_admin_value[sendmail_path]': `/usr/sbin/sendmail -t -i -f webmaster@${this.host.name} `
        }, {
            section: this.host.name
        });
        await createPoolFile(this.host.name, data);
        await Task.run('fpm.restart');
    }

    async remove() {
        await removePoolFile(this.host.name);
        await Task.run('fpm.restart');
    }
}

export default Pool;
