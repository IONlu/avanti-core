import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
import Registry from './registry.js';
import Database from './database.js';
import Config from './config.js';
import fs from 'fs';

const initDatabase = async () => {
    return new Promise((resolve) => {
        let db = new sqlite3.Database('/opt/avanti/db.sqlite3');
        let database = new Database(db);
        database.run(`
            CREATE TABLE IF NOT EXISTS "client" (
              "client" VARCHAR(100) NOT NULL,
              "user" VARCHAR(100) NOT NULL,
              "path" VARCHAR(200) NOT NULL,
              PRIMARY KEY ("client"));
        `).then(() => database.run(`
            CREATE TABLE IF NOT EXISTS "host" (
              "host" VARCHAR(100) NOT NULL,
              "client" VARCHAR(100) NOT NULL,
              "user" VARCHAR(100) NOT NULL,
              "path" VARCHAR(200) NOT NULL,
              PRIMARY KEY ("host"));
        `).then(() => resolve(database)));
    });
};

const createConfigFile = async (file) => {
    return new Promise((resolve, reject) => {
        fs.open(file, 'wx', (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    resolve();
                } else {
                    reject(err);
                }
                return;
            }

            fs.write(fd, JSON.stringify({
                clientPath: '/var/www/vhosts'
            }, null, 2), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
};

export default async () => {

    // create folder
    await mkdirp('/opt/avanti');

    // load config
    await createConfigFile('/opt/avanti/config.json');
    Registry.set('Config', new Config('/opt/avanti/config.json'));

    // init singletons
    Registry.set('Database', await initDatabase());

};
