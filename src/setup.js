import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
import registry from './registry.js';
import Database from './database.js';

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
            CREATE TABLE IF NOT EXISTS "host" (
              "host" VARCHAR(100) NOT NULL,
              "client" VARCHAR(100) NOT NULL,
              "user" VARCHAR(100) NOT NULL,
              "path" VARCHAR(200) NOT NULL,
              PRIMARY KEY ("host"));
        `).then(() => resolve(database));
    });
};

export default async () => {

    // create folder
    await mkdirp('/opt/avanti');

    // init singletons
    registry.set('Database', await initDatabase());

};
