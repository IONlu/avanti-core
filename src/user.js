var Promise = require('bluebird'),
    cp = require('child_process');

Promise.promisifyAll(cp);

function createHomeFolder(hostname, user) {
    return cp.execAsync('mkdir -p /var/www/vhosts/' + hostname).then(function() {
        return cp.execAsync('chown -R ' + user + ': /var/www/vhosts/' + hostname);
    });
}

function createBackupFolder() {
    return cp.execAsync('mkdir -p /var/www/backup');
}

module.exports = {

    create: function(hostname, user) {
        return cp.execAsync('useradd --home-dir /var/www/vhosts/' + hostname + ' --shell /bin/false ' + user)
            .then(createHomeFolder.bind(this, hostname, user));
    },

    remove: function(hostname, user) {
        return createBackupFolder().then(function() {

            // generate a compressed backup of the user's home folder and then remove the home folder
            return cp.execAsync('deluser --backup --backup-to /var/www/backup --remove-home ' + user).then(function() {

                // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
                return cp.execAsync('rm -fr /var/www/vhosts/' + hostname);
            });
        });
    }

};
