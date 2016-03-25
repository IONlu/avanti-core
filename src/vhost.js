var Promise = require('bluebird'),
    fs = require('fs'),
    cp = require('child_process'),
    Handlebars = require('handlebars');

Promise.promisifyAll(fs);
Promise.promisifyAll(cp);

function enableVhost(hostname) {
    return cp.execAsync('a2ensite ' + hostname);
}

function disableVhost(hostname) {
    return cp.execAsync('a2dissite ' + hostname);
}

function createVhostFile(hostname, data) {
    return fs.writeFileAsync('/etc/apache2/sites-available/' + hostname + '.conf', data);
}

function removeVhostFile(hostname) {
    return fs.unlinkAsync('/etc/apache2/sites-available/' + hostname + '.conf');
}

function reboot() {
    return cp.execAsync('service apache2 restart');
}

function testConfig() {
    return cp.execAsync('apachectl configtest');
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
