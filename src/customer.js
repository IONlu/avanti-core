var Promise = require('bluebird'),
    cp = require('child_process');

Promise.promisifyAll(cp);

function createHomeFolder(customer, user) {
    return cp.execAsync('mkdir -p /var/www/' + customer).then(function() {
        return cp.execAsync('chown -R ' + user + ': /var/www/' + customer);
    });
}

function createBackupFolder(customer) {
    return cp.execAsync('mkdir -p /var/backup-www/' + customer);
}

module.exports = {

    create: function(customer, user) {
        return cp.execAsync('useradd --home-dir /var/www/' + customer + ' --shell /bin/false ' + user)
            .then(createHomeFolder.bind(this, customer, user));
    },

    remove: function(customer, user) {
        return createBackupFolder().then(function() {

            // generate a compressed backup of the customer's home folder and then remove the home folder
            return cp.execAsync('deluser --backup --backup-to /var/www/backup --remove-home ' + user).then(function() {

                // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
                return cp.execAsync('rm -fr /var/www/' + customer);
            });
        });
    }

};
