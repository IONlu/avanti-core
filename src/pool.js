import ini from 'ini';
import * as Task from './task';

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
            'pm.max_requests': 500,
            'catch_workers_output': 'yes',
            'php_admin_value[open_basedir]': `${hostInfo.path}`,
            'php_admin_value[sys_temp_dir]': `${hostInfo.path}/temp`,
            'php_admin_value[session.save_path]': `${hostInfo.path}/sessions`,
            'php_admin_value[disable_functions]': 'exec,mail,passthru,popen,proc_open,show_source,shell,shell_exec,symlink,system,phpinfo',
            'php_admin_value[sendmail_path]': `/usr/sbin/sendmail -t -i -f webmaster@${this.host.name} `
        }, {
            section: this.host.name
        });
        await Task.run('fpm.pool.create', {
            hostname: this.host.name,
            php: hostInfo.php,
            data
        });
        await Task.run('fpm.configtest');
        await Task.run('fpm.reload');
    }

    async remove() {
        await Task.run('fpm.pool.remove', {
            hostname: this.host.name
        });
        await Task.run('fpm.configtest');
        await Task.run('fpm.reload');
    }
}

export default Pool;
