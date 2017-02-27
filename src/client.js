import exec from './exec.js';
import Host from './host.js';
import * as User from './helper/user.js';
import Registry from './registry.js';
import convert from './helper/convert.js';
import inquirer from 'inquirer';

// private functions
const createHomeFolder = async (name, home) => {
    await exec('mkdir -p {{home}}', { home });
    await exec('chown -R {{name}}:{{name}} {{home}}', { name, home });
};

// client class
class Client {
    constructor(name) {
        this.name = name;
        this.hostnames = {};
        this.db = Registry.get('Database');
        this.config = Registry.get('Config');
    }

    async info() {
        let result = await this.db.get(`
            SELECT *
            FROM "client"
            WHERE "client" = :client
            LIMIT 1
        `, {
            ':client': this.name
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
        const clientFolder = convert(this.name, '-a-z0-9_\.');

        const home = this.config.get('clientPath') + '/' + clientFolder;
        await User.create(user, home);
        await createHomeFolder(user, home);

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
        const info = await this.info();
        if (!info) {
            return;
        }

        let hosts = await this.hosts();
        if (hosts.length) {
            process.stdout.write('The following hosts will be deleted:\n');
            process.stdout.write(hosts.join(', ') + '\n');
            let { proceed } = await inquirer.prompt([{
                name: 'proceed',
                type: 'confirm',
                message: 'Are you sure you want to proceed?',
                default: false
            }]);
            if (!proceed) {
                return;
            }

            while (hosts.length)
            {
                let host = hosts.pop();
                await this.removeHost(host);
            }
        }

        await User.remove(info.user, `/var/www/backup/${info.user}`);

        await this.db.run(`
            DELETE
            FROM "client"
            WHERE "client" = :client
        `, {
            ':client': this.name
        });
    }

    async addHost(hostname) {
        await (new Host(this, hostname)).create();
    }

    async removeHost(hostname) {
        await (new Host(this, hostname)).remove();
    }

    async hosts() {
        let result = await Host.allByClient(this);
        let hosts = result.map(row => row.host);
        return hosts;
    }
}

Client.all = async () => {
    const db = Registry.get('Database');
    let result = await db.all(`
        SELECT *
        FROM "client"
        ORDER BY "client"
    `);
    return result;
};

export default Client;
