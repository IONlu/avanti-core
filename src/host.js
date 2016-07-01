import Promise from 'bluebird';
import fs from 'fs';
import exec from './exec.js';
import Handlebars from 'handlebars';
import Pool from './pool.js';
import Apache from './service/Apache.js';

const writeFile = Promise.promisify(fs.writeFile);
const readFile  = Promise.promisify(fs.readFile);
const unlink    = Promise.promisify(fs.unlink);

async function enableVhost(hostname) {
    await exec('a2ensite {{hostname}}', {
        hostname: hostname
    });
}

async function disableVhost(hostname) {
    await exec('a2dissite {{hostname}}', {
        hostname: hostname
    });
}

async function createVhostFile(hostname, data) {
    await writeFile('/etc/apache2/sites-available/' + hostname + '.conf', data);
}

async function removeVhostFile(hostname) {
    await unlink('/etc/apache2/sites-available/' + hostname + '.conf');
}

async function createVhostFolder(customer, name) {
    await exec('mkdir -p /var/www/{{customer}}/{{name}}', {
        name: name,
        customer: customer
    });
    await exec('chown -R {{customer}}:{{customer}} /var/www/{{customer}}/{{name}}', {
        name: name,
        customer: customer
    });
}

async function removeVhostFolder(customer, name) {
    await exec('rm -fr /var/www/{{customer}}/{{name}}', {
        name: name,
        customer: customer
    });
}

async function addPool(host) {
    await (new Pool(host)).create();
}

async function removePool(host) {
    await (new Pool(host)).remove();
}

// load and compile vhost template
const loadTemplate = readFile(__dirname + '/templates/vhost.hbs', 'utf-8')
    .then(function(template) {
        return Handlebars.compile(template);
    });

class Host {
    constructor(customer, name) {
        this.customer = customer;
        this.name = name;
    }

    async create() {
        let template = await loadTemplate;
        let data = template(this);
        await createVhostFile(this.name, data);
        await createVhostFolder(this.customer.name, this.name);
        await enableVhost(this.name);
        await addPool(this);
        await Apache.restart();
    }

    async remove() {
        await disableVhost(this.name);
        await removeVhostFile(this.name);
        await removeVhostFolder(this.customer.name, this.name);
        await removePool(this);
        await Apache.restart();
    }
}

export default Host;
