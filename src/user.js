var Promise = require('bluebird'),
    exec = require('child_process').exec;

Promise.promisify(exec);

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
        return exec('useradd --home-dir /var/www/vhosts/' + hostname + ' --shell /bin/false ' + user)
            .then(createHomeFolder.bind(this, hostname, user));
    },

    remove: function(hostname, user) {
        return createBackupFolder().then(function() {

            // generate a compressed backup of the user's home folder and then remove the home folder

            return exec('deluser --backup --backup-to /var/www/backup --remove-home ' + user).then(function() {

                // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
                return exec('rm -fr /var/www/vhosts/' + hostname);
            });
        });
    }

};
