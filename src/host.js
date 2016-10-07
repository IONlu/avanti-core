import Promise from 'bluebird';
import fs from 'fs';
import exec from './exec.js';
import Handlebars from 'handlebars';
import Pool from './pool.js';
import Apache from './service/Apache.js';

const writeFile = Promise.promisify(fs.writeFile);
const readFile  = Promise.promisify(fs.readFile);
const unlink    = Promise.promisify(fs.unlink);

const enableVhost = async (hostname) => {
    await exec('a2ensite {{hostname}}', { hostname });
};

const disableVhost = async (hostname) => {
    await exec('a2dissite {{hostname}}', { hostname });
};

const createVhostFile = async (hostname, data) => {
    await writeFile(`/etc/apache2/sites-available/${hostname}.conf`, data);
};

const removeVhostFile = async (hostname) => {
    await unlink(`/etc/apache2/sites-available/${hostname}.conf`);
};

const createVhostFolder = async (client, name) => {
    await exec('mkdir -p /var/www/{{client}}/{{name}}', { name, client });
    await exec('chown -R {{client}}:{{client}} /var/www/{{client}}/{{name}}', { name, client });
};

const removeVhostFolder = async (client, name) => {
    await exec('rm -fr /var/www/{{client}}/{{name}}', { name, client });
};

const addPool = async (host) => {
    await (new Pool(host)).create();
};

const removePool = async (host) => {
    await (new Pool(host)).remove();
};

// load and compile vhost template
const loadTemplate = readFile(__dirname + '/templates/vhost.hbs', 'utf-8')
    .then(function(template) {
        return Handlebars.compile(template);
    });

class Host {
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }

    async create() {
        let template = await loadTemplate;
        let data = template(this);
        await createVhostFile(this.name, data);
        await createVhostFolder(this.client.name, this.name);
        await enableVhost(this.name);
        await addPool(this);
        await Apache.restart();
    }

    async remove() {
        await disableVhost(this.name);
        await removeVhostFile(this.name);
        await removeVhostFolder(this.client.name, this.name);
        await removePool(this);
        await Apache.restart();
    }
}

export default Host;
