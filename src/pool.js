var Promise = require('bluebird'),
    ini = require('ini'),
    fs = require('fs'),
    exec = require('child_process').exec;

Promise.promisifyAll(fs);
Promise.promisify(exec);

function createPoolFile(hostname, data) {
    return fs.writeFile('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf', data);
}

function removePoolFile(hostname) {
    return fs.unlink('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf');
}

function reboot() {
    return exec('service php7.0-fpm restart');
}

module.exports = {

    create: function(hostname, user) {
        var data = ini.encode({
            user: user,
            group: user,
            listen: '/run/php/' + hostname + '.sock',
            'listen.owner': 'www-data',
            'listen.group': 'www-data',
            pm: 'dynamic',
            'pm.max_children': 6,
            'pm.start_servers': 1,
            'pm.min_spare_servers': 1,
            'pm.max_spare_servers': 3,
            'php_admin_value[open_basedir]': '/var/www/vhosts/' + hostname
        }, {
            section: hostname
        });
        return createPoolFile(hostname, data)
            .then(reboot.bind(this));
    },

    remove: function(hostname) {
        return removePoolFile(hostname)
            .then(reboot.bind(this));
    }

};
