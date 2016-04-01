var Promise = require('bluebird'),
    ini = require('ini'),
    fs = require('fs'),
    exec = require('./exec.js');

var writeFile = Promise.promisify(fs.writeFile),
    unlink = Promise.promisify(fs.unlink);

function createPoolFile(hostname, data) {
    return writeFile('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf', data);
}

function removePoolFile(hostname) {
    return unlink('/etc/php/7.0/fpm/pool.d/' + hostname + '.conf');
}

function reboot() {
    return exec('service php7.0-fpm restart');
}

var Pool = function(vhost) {
    this.vhost = vhost;
}

Pool.prototype.create = function() {
    var data = ini.encode({
        user: this.vhost.customer.name,
        group: this.vhost.customer.name,
        listen: '/run/php/' + this.vhost.hostname + '.sock',
        'listen.owner': 'www-data',
        'listen.group': 'www-data',
        pm: 'dynamic',
        'pm.max_children': 6,
        'pm.start_servers': 1,
        'pm.min_spare_servers': 1,
        'pm.max_spare_servers': 3,
        'php_admin_value[open_basedir]': '/var/www/' + this.vhost.customer.name + '/' + this.vhost.hostname
    }, {
        section: this.vhost.hostname
    });
    return createPoolFile(this.vhost.hostname, data)
        .then(reboot.bind(this));
}

Pool.prototype.remove = function() {
    return removePoolFile(this.vhost.hostname)
        .then(reboot.bind(this));
}

module.exports = Pool;
