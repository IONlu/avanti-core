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

var Vhost = function(customer, hostname) {
    this.customer = customer;
    this.hostname = hostname;
}

Vhost.prototype.create = function() {
    var data = vhostTemplate(this);
    return createVhostFile(this.hostname, data)
        .then(enableVhost.bind(this, this.hostname))
        .then(reboot.bind(this));
}

Vhost.prototype.remove = function() {
    return disableVhost(this.hostname)
        .then(removeVhostFile.bind(this, this.hostname))
        .then(reboot.bind(this));
};

module.exports = Vhost;
