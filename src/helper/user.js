import exec from './exec.js';

const home = async (name) => await exec('eval echo ~{{name}}', { name });

const exists = async (name) => !! await exec('id -u {{name}} 2> /dev/null', { name });

const create = async (name) => {
    if (! await exists(name)) {
        await exec('useradd --home-dir /var/www/{{name}} --shell /bin/false {{name}}', { name });
    }
};

const remove = async (name, backupFolder) => {
    const homeFolder = await home(name);

    if (backupFolder) {
        await exec('mkdir -p {{backupFolder}}', { backupFolder });

        // generate a compressed backup of the customer's home folder and then remove the home folder
        await exec('deluser --backup --backup-to {{backupFolder}} --remove-home {{name}}', { name, backupFolder });
    } else {
        await exec('deluser --backup --remove-home {{name}}', { name });
    }

    // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
    await exec('rm -fr {{homeFolder}}', { homeFolder });
};

export { home, exists, create, remove };
