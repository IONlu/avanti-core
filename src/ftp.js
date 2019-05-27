import Registry from './registry';
import * as Task from './task';
import exec from './exec';

const getUid = async (user) => {
    return (await exec('id -u {{user}}', { user })).trim();
};

const getGid = async (user) => {
    return (await exec('id -g {{user}}', { user })).trim();
};

const generatePasswdHash = async (passwd) => {
    let result = await exec('ftpasswd --stdin --hash --sha256', {}, passwd);
    let [, password] = result.trim().split(/: +/);
    return password
};

const convertToPasswdLine = async ({ user, path, ftpasswd }) => {
    let [ uid, gid ] = await Promise.all([
        getUid(user),
        getGid(user)
    ])
    return [
        user,
        ftpasswd,
        uid,
        gid,
        '',
        path,
        '/bin/false'
    ].join(':');
};

class Ftp {
    constructor(host) {
        this.host = host;
        this.db = Registry.get('Database');
    }

    async create (passwd) {
        if (!passwd || passwd.length < 10) {
            throw new Error('Password needs to be at least 10 characters long')
        }
        let passwdHash = passwd
            ? await generatePasswdHash(passwd)
            : null;
        await this.db
            .table('host')
            .where({
                client: this.host.client.name,
                host: this.host.name
            })
            .update({
                ftpasswd: passwdHash
            });
        await Ftp.refresh();
    }

    async remove () {
        await this.db
            .table('host')
            .where({
                client: this.host.client.name,
                host: this.host.name
            })
            .update({
                ftpasswd: null
            });
        await Ftp.refresh();
    }
}

Ftp.refresh = async () => {
    const db = Registry.get('Database');
    let result = await db
        .table('host')
        .select('user', 'path', 'ftpasswd')
        .whereNotNull('ftpasswd')
        .orderBy('user');

    let data = (await Promise.all(result.map(convertToPasswdLine))).join('\n');
    return await Task.run('ftp.create', { data });
}

export default Ftp;
