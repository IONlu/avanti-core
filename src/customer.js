var Promise = require('bluebird'),
    cp = require('child_process');

Promise.promisifyAll(cp);

function createHomeFolder(customer) {
    return cp.execAsync('mkdir -p /var/www/' + customer).then(function() {
        return cp.execAsync('chown -R ' + customer + ': /var/www/' + customer);
    });
}

function createBackupFolder(customer) {
    return cp.execAsync('mkdir -p /var/backup-www/' + customer);
}

module.exports = {

    create: function(customer) {
        return cp.execAsync('useradd --home-dir /var/www/' + customer + ' --shell /bin/false ' + customer)
            .then(createHomeFolder.bind(this, customer));
    },

    remove: function(customer) {
        return createBackupFolder().then(function() {

            // generate a compressed backup of the customer's home folder and then remove the home folder
            return cp.execAsync('deluser --backup --backup-to /var/www/backup --remove-home ' + customer).then(function() {

                // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
                return cp.execAsync('rm -fr /var/www/' + customer);
            });
        });
    }

};
