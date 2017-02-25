import Promise from 'bluebird';
import fs from 'fs';
import exec from './exec.js';
import Handlebars from 'handlebars';
import Pool from './pool.js';
import Apache from './service/Apache.js';
import Registry from './registry.js';
import * as User from './helper/user.js';
import convert from './helper/convert.js';

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

const createVhostFolder = async (path, user) => {
    await exec('mkdir -p {{path}}', { path });
    await exec('mkdir -p {{path}}', { path: path + '/temp' });
    await exec('mkdir -p {{path}}', { path: path + '/logs' });
    await exec('mkdir -p {{path}}', { path: path + '/sessions' });
    await exec('mkdir -p {{path}}', { path: path + '/web' });
    await exec('chown -R {{user}}:{{user}} {{path}}', { path, user });
};

const removeVhostFolder = async (path) => {
    await exec('rm -fr {{path}}', { path });
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
        this.db = Registry.get('Database');
    }

    async info() {
        let result = await this.db.get(`
            SELECT *
            FROM "host"
            WHERE "client" = :client
              AND "host" = :host
            LIMIT 1
        `, {
            ':host': this.name,
            ':client': this.client.name
        });
        return result;
    }

    async exists() {
        return !! await this.info();
    }

    async create() {
        if (await this.exists()) {
            return;
        }

        // find free username
        const user = await User.free(this.name);
        const hostFolder = convert(this.name, '-a-z0-9_\.');

        // create user
        const clientInfo = await this.client.info();
        const home = `${clientInfo.path}/${hostFolder}`;
        await User.create(user, home);

        const documentRoot = `${home}/web`;
        const logsFolder = `${home}/logs`;
        let template = await loadTemplate;
        let data = template(Object.assign(this, { user, documentRoot, logsFolder }));
        await createVhostFile(this.name, data);
        await createVhostFolder(home, user);
        await enableVhost(this.name);

        await this.db.run(`
            INSERT
            INTO "host"
              ("host", "client", "user", "path")
            VALUES
              (:host, :client, :user, :path)
        `, {
            ':host': this.name,
            ':client': this.client.name,
            ':user': user,
            ':path': home
        });

        await addPool(this);

        await Apache.restart();
    }

    async remove() {
        const info = await this.info();
        if (!info) {
            return;
        }

        await disableVhost(this.name);

        await Promise.all([
            removeVhostFile(this.name),
            removeVhostFolder(info.path),
            removePool(this)
        ]);

        await this.db.run(`
            DELETE
            FROM "host"
            WHERE "host" = :host
        `, {
            ':host': this.name
        });

        await Apache.restart();
    }
}

Host.all = async () => {
    const db = Registry.get('Database');
    let result = await db.all(`
        SELECT *
        FROM "host"
        ORDER BY "host"
    `);
    return result;
};


export default Host;
