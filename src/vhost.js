var Promise = require('bluebird'),
    fs = require('fs'),
    exec = require('./exec.js'),
    Handlebars = require('handlebars');

var writeFile = Promise.promisify(fs.writeFile),
    unlink = Promise.promisify(fs.unlink);

function enableVhost(hostname) {
    return exec('a2ensite {{hostname}}', {hostname: hostname});
}

function disableVhost(hostname) {
    return exec('a2dissite {{hostname}}', {hostname: hostname});
}

function createVhostFile(hostname, data) {
    return writeFile('/etc/apache2/sites-available/' + hostname + '.conf', data);
}

function removeVhostFile(hostname) {
    return unlink('/etc/apache2/sites-available/' + hostname + '.conf');
}

function reboot() {
    return exec('service apache2 restart');
}

function testConfig() {
    return exec('apachectl configtest');
}

// compile vhost template
var vhostTemplate = Handlebars.compile(__dirname + '/templates/vhost.hbs');

module.exports = {

    create: function(hostname, customer) {
        var data = vhostTemplate({
            hostname: hostname,
            customer: customer
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
