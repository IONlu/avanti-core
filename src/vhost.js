var Promise = require('bluebird'),
    fs = require('fs'),
    exec = require('./exec.js'),
    Handlebars = require('handlebars');

var writeFile = Promise.promisify(fs.writeFile),
    readFile = Promise.promisify(fs.readFile),
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

function createVhostFolder(customer, name) {
    return exec('mkdir -p /var/www/{{customer}}/{{name}}', {name: name, customer: customer})
        .then(function() {
            return exec('chown -R {{customer}}:{{customer}} /var/www/{{customer}}/{{name}}', {name: name, customer: customer});
        });
}

function removeVhostFolder(customer, name) {
    return exec('rm -fr /var/www/{{customer}}/{{name}}', {name: name, customer: customer});
}

// load and compile vhost template
var loadTemplate = readFile(__dirname + '/templates/vhost.hbs', 'utf-8')
    .then(function(template) {
        return Handlebars.compile(template);
    });

var Vhost = function(customer, hostname) {
    this.customer = customer;
    this.hostname = hostname;
}

Vhost.prototype.create = function() {
    var _t = this;
    return loadTemplate
        .then(function(template) {
            var data = template(_t);
            return createVhostFile(_t.hostname, data);
        })
        .then(createVhostFolder.bind(this, this.customer.name, this.hostname))
        .then(enableVhost.bind(this, this.hostname))
        .then(reboot.bind(this));
}

Vhost.prototype.remove = function() {
    return disableVhost(this.hostname)
        .then(removeVhostFile.bind(this, this.hostname))
        .then(removeVhostFolder.bind(this, this.customer.name, this.hostname))
        .then(reboot.bind(this));
};

module.exports = Vhost;
