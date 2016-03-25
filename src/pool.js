var Promise = require('bluebird'),
    ini = require('ini'),
    fs = require('fs'),
    cp = require('child_process');

Promise.promisifyAll(fs);
Promise.promisifyAll(cp);

function createPoolFile(hostname, data) {
    return fs.writeFileAsync('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf', data);
}

function removePoolFile(hostname) {
    return fs.unlinkAsync('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf');
}

function reboot() {
    return cp.execAsync('service php7.0-fpm restart');
}

module.exports = {

    create: function(hostname, customer) {
        var data = ini.encode({
            user: customer,
            group: customer,
            listen: '/run/php/' + hostname + '.sock',
            'listen.owner': 'www-data',
            'listen.group': 'www-data',
            pm: 'dynamic',
            'pm.max_children': 6,
            'pm.start_servers': 1,
            'pm.min_spare_servers': 1,
            'pm.max_spare_servers': 3,
            'php_admin_value[open_basedir]': '/var/www/' + customer + '/' + hostname
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
