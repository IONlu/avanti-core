import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
import registry from './registry.js';
import Database from './database.js';

const initSqlite = async () => {
    var db = new sqlite3.Database('/opt/avanti/db.sqlite3');
    return new Promise((resolve) => {
        db.serialize();
        resolve(db);
    });
};

export default async () => {

    // create folder
    await mkdirp('/opt/avanti');

    // init sqlite db
    var sqlite_db = await initSqlite();

    // init singletons
    registry.set('Database', new Database(sqlite_db));

};
