var exec = require('exec-as-promised')();

function createHomeFolder(domain, user)
{
    return exec('mkdir -p /var/www/vhosts/' + domain).then(function() {
        return exec('chown -R ' + user + ': /var/www/vhosts/' + domain);
    });
}

function createBackupFolder()
{
    return exec('mkdir -p /var/www/backup');
}

module.exports = {

    create: function(domain, user)
    {
        return exec('useradd --home-dir /var/www/vhosts/' + domain + ' --shell /bin/false ' + user).then(function() {
            return createHomeFolder(domain, user);
        });
    },


    remove: function(domain, user)
    {
        return createBackupFolder().then(function() {
            return exec('deluser --backup --backup-to /var/www/backup --remove-home ' + user).then(function() {
                return exec('rm -fr /var/www/vhosts/' + domain);
            }); 
        });
    }

};
