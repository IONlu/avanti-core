var Promise = require('bluebird'),
    fs = require('fs'),
    cp = require('child_process'),
    Handlebars = require('handlebars');

Promise.promisifyAll(fs);
Promise.promisifyAll(cp);

function enableVhost(hostname) {
    return cp.exec('a2ensite ' + hostname);
}

function disableVhost(hostname) {
    return cp.exec('a2dissite ' + hostname);
}

function createVhostFile(hostname, data) {
    return fs.writeFile('/etc/apache2/sites-available/' + hostname + '.conf', data);
}

function removeVhostFile(hostname) {
    return fs.unlink('/etc/apache2/sites-available/' + hostname + '.conf');
}

function reboot() {
    return cp.exec('service apache2 restart');
}

function testConfig() {
    return cp.exec('apachectl configtest');
}

// compile vhost template
var vhostTemplate = Handlebars.compile(__dirname + '/templates/vhost.hbs');

module.exports = {

    create: function(hostname, user) {
        var data = vhostTemplate({
            hostname: hostname
        });
        return createVhostFile(hostname, data)
            .then(enableVhost.bind(this))
            .then(reboot.bind(this));
    },

    remove: function(hostname) {
        return disableVhost(hostname)
            .then(removeVhostFile.bind(this, hostname))
            .then(reboot.bind(this));
    }

};
