var Promise = require('bluebird'),
    cp = require('child_process');

Promise.promisifyAll(cp);

// private functions

function createHomeFolder(name) {
    return cp.execAsync('mkdir -p /var/www/' + name).then(function() {
        return cp.execAsync('chown -R ' + name + ': /var/www/' + name);
    });
}

function createBackupFolder(name) {
    return cp.execAsync('mkdir -p /var/backup-www/' + name);
}

function removeHomeFolder(name) {
    return cp.execAsync('rm -fr /var/www/' + name);
}

// customer class

var Customer = function(name) {
    this.name = name;
    this.hostnames = {};
}

Customer.prototype.create = function() {
    return cp.execAsync('useradd --home-dir /var/www/' + this.name + ' --shell /bin/false ' + this.name)
        .then(createHomeFolder.bind(this, this.name));
}

Customer.prototype.remove = function() {
    var _t = this;
    return createBackupFolder()

    // generate a compressed backup of the customer's home folder and then remove the home folder
    .then(function() {
        return cp.execAsync('deluser --backup --backup-to /var/www/backup --remove-home ' + _t.name)
    })

    // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
    .then(removeHomeFolder.bind(this, this.name));
}

module.exports = Customer;
