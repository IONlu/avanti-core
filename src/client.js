import exec from './exec.js';
import Host from './host.js';
import * as User from './helper/user.js';
import Registry from './registry.js';

// private functions

const createHomeFolder = async (name) => {
    await exec('mkdir -p /var/www/{{name}}', { name });
    await exec('chown -R {{name}}:{{name}} /var/www/{{name}}', { name });
    return `/var/www/${name}`;
};

const createBackupFolder = async (name) => {
    await exec('mkdir -p /var/backup-www/{{name}}', { name });
};

const removeHomeFolder = async (name) => {
    await exec('rm -fr /var/www/{{name}}', { name });
};

// client class

class Client {
    constructor(name) {
        this.name = name;
        this.hostnames = {};
        this.db = Registry.get('Database');
    }

    async exists() {
        let result = await this.db.get(`
            SELECT "client"
            FROM "client"
            WHERE "client" = :client
            LIMIT 1
        `, {
            ':client': this.name
        });
        return result && result.client;
    }

    async create() {
        if (await this.exists()) {
            return;
        }

        // find free username
        const convertedUser = await User.convert(this.name);
        var user = convertedUser;
        var index = 0;
        while (await User.exists(user)) {
            index++;
            user = User.renumber(convertedUser, index);
        }

        await User.create(user);
        const home = await createHomeFolder(user);

        await this.db.run(`
            INSERT
            INTO "client"
              ("client", "user", "path")
            VALUES
              (:client, :user, :path)
        `, {
            ':client': this.name,
            ':user': user,
            ':path': home
        });
    }

    async remove() {
        await createBackupFolder(this.name);

        // generate a compressed backup of the client's home folder and then remove the home folder
        await exec('deluser --backup --backup-to /var/backup-www/{{name}} --remove-home {{name}}', {
            name: this.name
        });

        // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
        await removeHomeFolder(this.name);
    }

    async addHost(hostname) {
        await (new Host(this, hostname)).create();
    }

    async removeHost(hostname) {
        await (new Host(this, hostname)).remove();
    }
}

export default Client;
