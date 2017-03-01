import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
import Registry from './registry.js';
import Database from './database.js';
import Config from './config.js';
import path from 'path';
import fs from 'fs';
import exec from './exec.js';
import Knex from 'knex';


const initDatabase = async (target) => {
    var db = Knex({
        client: 'sqlite3',
        connection: {
            filename: `${target}/db.sqlite3`
        },
        useNullAsDefault: true
    });
    await db.migrate.latest({
        directory: './dist/database/migrations'
    })
    .then((data) => {
        console.log('migration done', data);
    });

    process.exit();

    return new Promise((resolve) => {
        let db = new sqlite3.Database(`${target}/db.sqlite3`);
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

const installSkeleton = async (target) => {
    return new Promise((resolve) => {
        fs.access(target, fs.R_OK, async (err) => {
            if (err) {
                // create folder
                await mkdirp(path.dirname(target));

                // copy skeleton
                const skeleton = path.dirname(__dirname) + '/skeleton';
                await exec('cp -r {{skeleton}} {{target}}', { skeleton, target });

            }
            resolve();
        });

    });
};

export default async (target) => {

    // install skeleton
    await installSkeleton(target);

    // load config
    Registry.set('Config', new Config(target + '/config.json'));

    // init singletons
    Registry.set('Database', await initDatabase(target));

};
