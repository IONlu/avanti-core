var exec = require('exec-as-promised')();

function createHomeFolder(hostname, user) {
    return exec('mkdir -p /var/www/vhosts/' + hostname).then(function() {
        return exec('chown -R ' + user + ': /var/www/vhosts/' + hostname);
    });
}

function createBackupFolder() {
    return exec('mkdir -p /var/www/backup');
}

module.exports = {

    create: function(hostname, user) {
        return exec('useradd --home-dir /var/www/vhosts/' + hostname + ' --shell /bin/false ' + user).then(function() {
            return createHomeFolder(hostname, user);
        });
    },


    remove: function(hostname, user) {
        return createBackupFolder().then(function() {
            return exec('deluser --backup --backup-to /var/www/backup --remove-home ' + user).then(function() {
                return exec('rm -fr /var/www/vhosts/' + hostname);
            });
        });
    }

};