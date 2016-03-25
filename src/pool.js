var ini = require('ini'),
    fs = require('fs-promise'),
    exec = require('exec-as-promised')();

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
            'pm.max_children': 5,
            'pm.start_servers': 2,
            'pm.min_spare_servers': 1,
            'pm.max_spare_servers': 3
        }, {
            section: hostname
        });
        return createPoolFile(hostname, data).then(function() {
            return reboot();
        });
    },

    remove: function(hostname) {
        return removePoolFile(hostname).then(function() {
            return reboot();
        });
    }

};