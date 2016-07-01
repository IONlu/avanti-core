import exec from './exec.js';
import Host from './host.js';

// private functions

const createHomeFolder = async (name) => {
    await exec('mkdir -p /var/www/{{name}}', { name });
    await exec('chown -R {{name}}:{{name}} /var/www/{{name}}', { name });
};

const createBackupFolder = async (name) => {
    await exec('mkdir -p /var/backup-www/{{name}}', { name });
};

const removeHomeFolder = async (name) => {
    await exec('rm -fr /var/www/{{name}}', { name });
};

// customer class

class Customer {
    constructor(name) {
        if (name.length > 16 || name.match(/[^a-z0-9]/i)) {
            throw `invalid customer name "${name}"`;
        }
        this.name = name;
        this.hostnames = {};
    }

    async create() {
        await exec('useradd --home-dir /var/www/{{name}} --shell /bin/false {{name}}', {
            name: this.name
        });
        await createHomeFolder(this.name);
    }

    async remove() {
        await createBackupFolder(this.name);

        // generate a compressed backup of the customer's home folder and then remove the home folder
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

export default Customer;
