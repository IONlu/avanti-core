import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import * as dir from './dir';

const access = Promise.promisify(fs.access);
const unlink = Promise.promisify(fs.unlink);
const writeFile = Promise.promisify(fs.writeFile);

const exists = async file => {
    return access(file, fs.constants.R_OK)
        .then(() => true)
        .catch(() => false)
}

const create = async (file, data = '') => {
    return dir.create(path.dirname(file))
        .then(() => writeFile(file, data))
}

const remove = async file => {
    return exists(file)
        .then(exists => {
            if (exists) {
                unlink(file)
            }
        })
}

export {
    exists,
    create,
    remove
}
