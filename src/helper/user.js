import { Iconv } from 'iconv';
import exec from '../exec.js';

// validates user name format for ubuntu
const validate = (name) => {
    return name.length <= 32 && name.match(/^[a-z][-a-z0-9_]*$/);
};

// coverts name into a valid ubuntu username
const convert = (name) => {
    let iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE');
    return iconv.convert(name).toString()
                .toLowerCase()
                .replace(/[^-a-z0-9_]/, '')
                .replace(/^[0-9]+/, '')
                .substr(0, 32);
};

// adds a number to the username
const renumber = (name, number) => {
    number = '' + number;
    var combinedLength = name.length + number.length;
    if (combinedLength > 32) {
        name = name.substr(0, name.length - (combinedLength - 32));
    }
    return name + number;
};

// returns users home folder
const home = async (name) => {
    return await exec('eval echo ~{{name}}', { name });
};

// checks if user exists
const exists = async (name) => {
    try {
        await exec('id -u {{name}} 2> /dev/null', { name });
        return true;
    } catch (e) {
        return false;
    }
};

// creates a user if valid
const create = async (name) => {
    if (! validate(name)) {
        throw 'invalid username "' + name + '"';
    }
    if (! await exists(name)) {
        await exec('useradd --home-dir /var/www/{{name}} --shell /bin/false {{name}}', { name });
    }
};

// removes a user if exists
const remove = async (name, backupFolder) => {
    if (! await exists(name)) {
        return;
    }

    const homeFolder = await home(name);

    if (backupFolder) {
        await exec('mkdir -p {{backupFolder}}', { backupFolder });

        // generate a compressed backup of the client's home folder and then remove the home folder
        await exec('deluser --backup --backup-to {{backupFolder}} --remove-home {{name}}', { name, backupFolder });
    } else {
        await exec('deluser --backup --remove-home {{name}}', { name });
    }

    // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
    await exec('rm -fr {{homeFolder}}', { homeFolder });
};

export {
    validate,
    convert,
    renumber,
    home,
    exists,
    create,
    remove
};
