var Promise = require('bluebird'),
    cp = require('child_process');

Promise.promisifyAll(cp);

function createHomeFolder(hostname, user) {
    return cp.exec('mkdir -p /var/www/vhosts/' + hostname).then(function() {
        return cp.exec('chown -R ' + user + ': /var/www/vhosts/' + hostname);
    });
}

function createBackupFolder() {
    return cp.exec('mkdir -p /var/www/backup');
}

module.exports = {

    create: function(hostname, user) {
        return cp.exec('useradd --home-dir /var/www/vhosts/' + hostname + ' --shell /bin/false ' + user)
            .then(createHomeFolder.bind(this, hostname, user));
    },

    remove: function(hostname, user) {
        return createBackupFolder().then(function() {
            return cp.exec('deluser --backup --backup-to /var/www/backup --remove-home ' + user).then(function() {
                return cp.exec('rm -fr /var/www/vhosts/' + hostname);
            });
        });
    }

};