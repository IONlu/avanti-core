var Promise = require('bluebird'),
    ini = require('ini'),
    fs = require('fs'),
    Apache = require('./service/Apache');

var writeFile = Promise.promisify(fs.writeFile),
    unlink = Promise.promisify(fs.unlink);

function createPoolFile(hostname, data) {
    return writeFile('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf', data);
}

function removePoolFile(hostname) {
    return unlink('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf');
}

var Pool = function(host) {
    this.host = host;
};

Pool.prototype.create = function() {
    var data = ini.encode({
        user: this.host.customer.name,
        group: this.host.customer.name,
        listen: '/run/php/' + this.host.name + '.sock',
        'listen.owner': 'www-data',
        'listen.group': 'www-data',
        pm: 'dynamic',
        'pm.max_children': 6,
        'pm.start_servers': 1,
        'pm.min_spare_servers': 1,
        'pm.max_spare_servers': 3,
        'php_admin_value[open_basedir]': '/var/www/' + this.host.customer.name + '/' + this.host.name
    }, {
        section: this.host.name
    });
    return createPoolFile(this.host.name, data)
        .then(Fpm.restart.bind(Fpm));
};

Pool.prototype.remove = function() {
    return removePoolFile(this.host.name)
        .then(Fpm.restart.bind(Fpm));
};

module.exports = Pool;
