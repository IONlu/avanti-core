import Promise from 'bluebird';
import fs from 'fs';
import exec from './exec';
import Handlebars from 'handlebars';
import Pool from './pool.js';
import Registry from './registry';
import * as User from './helper/user';
import convert from './helper/convert';
import * as PHP from './helper/php';
import * as Task from './task';
import Client from './client';

const readFile  = Promise.promisify(fs.readFile);

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
        this.name = ''+name;
        this.db = Registry.get('Database');
    }

    async info() {
        let result = await this.db
            .table('host')
            .first('*')
            .where({
                host: this.name,
                client: this.client.name
            })
            .limit(1);
        return result;
    }

    async exists() {
        return !! await this.info();
    }

    async create({ php } = {}) {
        if (await this.exists()) {
            return;
        }

        // get php version to use
        if (php) {
            if (!await PHP.available(php)) {
                throw new Error(`PHP version ${php} is not available`);
            }
        } else {
            php = await PHP.latest();
        }

        // find free username and collect data for database
        const user = await User.free(this.name,'h');
        const hostFolder = convert(this.name,'-a-z0-9_\.','f');
        const clientInfo = await this.client.info();
        const home = `${clientInfo.path}/${hostFolder}`;

        // insert into database
        await this.db
            .table('host')
            .insert({
                host: this.name,
                client: this.client.name,
                user: user,
                path: home,
                php
            });

        // create user
        await User.create(user, home);

        // create host file
        await this.updateHost();

        // create vhost folder
        await createVhostFolder(home, user);
        await Task.run('apache.vhost.enable', {
            hostname: this.name
        });

        // create fpm pool
        await addPool(this);

        // reload apache
        await Task.run('apache.configtest');
        await Task.run('apache.reload');
    }

    async updateHost() {
        const [ info, template ] = await Promise.all([
            this.info(),
            loadTemplate
        ]);

        const documentRoot = `${info.path}/web`;
        const logsFolder = `${info.path}/logs`;
        let data = template(Object.assign(this, {
            port: 80,
            user: info.user,
            documentRoot,
            logsFolder,
            alias: info.alias? info.alias.split(',') : null
        }));
        await Task.run('apache.vhost.create', {
            hostname: this.name,
            data
        });
    }

    async remove() {
        const info = await this.info();
        if (!info) {
            return;
        }

        await Task.run('apache.vhost.disable', {
            hostname: this.name
        });

        await Promise.all([
            Task.run('apache.vhost.remove', {
                hostname: this.name
            }),
            removePool(this),
            removeVhostFolder(info.path)
        ]);
        User.remove(info.user, `/var/www/backup/${info.user}`);

        // reload apache
        await Task.run('apache.configtest');
        await Task.run('apache.reload');

        await this.db
            .table('host')
            .where({
                client: this.client.name,
                host: this.name
            })
            .delete();
    }

    async createAlias(alias) {
        let info = await this.info();
        var currentAlias = info.alias? info.alias.split(',') : [];
        if (currentAlias.indexOf(alias) > -1) {
            return;
        }
        currentAlias.push(alias);
        await this.db
            .table('host')
            .where({
                client: this.client.name,
                host: this.name
            })
            .update({
                alias: currentAlias.join(',')
            });
        await this.updateHost();

        // reload apache
        await Task.run('apache.configtest');
        await Task.run('apache.reload');
    }

    async removeAlias(alias) {
        let info = await this.info();
        var currentAlias = info.alias? info.alias.split(',') : [];
        var index = currentAlias.indexOf(alias);
        if (index < 0) {
            return;
        }
        currentAlias.splice(index, 1);
        await this.db
            .table('host')
            .where({
                client: this.client.name,
                host: this.name
            })
            .update({
                alias: currentAlias.join(',')
            });
        await this.updateHost();

        // reload apache
        await Task.run('apache.configtest');
        await Task.run('apache.reload');
    }

    async php(php) {
        if (!(await this.exists())) {
            throw new Error(`Host "${this.name}" does not exist`);
        }

        // get php version to use
        if (php) {
            if (!await PHP.available(php)) {
                throw new Error(`PHP version ${php} is not available`);
            }
        } else {
            php = await PHP.latest();
        }

        // update database
        await this.db
            .table('host')
            .where({
                client: this.client.name,
                host: this.name
            })
            .update({ php });

        await addPool(this);
    }
}

Host.list = async () => {
    const db = Registry.get('Database');
    let result = await db
        .table('host')
        .select('*')
        .orderBy('host');
    return result;
};

Host.listByClient = async (client) => {
    const db = Registry.get('Database');
    let result = await db
        .table('host')
        .select('*')
        .where({
            client: client.name
        })
        .orderBy('host');
    return result;
};

Host.get = async (name) => {
    const db = Registry.get('Database');
    let result = await db
        .table('host')
        .select('client')
        .where({
            host: name
        });
    if (!result.length) {
        throw new Error(`Host "${name}" does not exist`);
    }
    if (result.length > 1) {
        throw new Error(`Host "${name}" is not unique`);
    }
    return (new Client(result[0].client)).host(name);
};

export default Host;
