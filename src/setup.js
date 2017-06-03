import mkdirp from 'mkdirp';
import Registry from './registry.js';
import Config from './config.js';
import path from 'path';
import fs from 'fs';
import exec from './exec.js';
import chalk from 'chalk';
import Knex from 'knex';

const initDatabase = async (target) => {
    var db = Knex({
        client: 'sqlite3',
        connection: {
            filename: `${target}/db.sqlite3`
        },
        useNullAsDefault: true,
        migrations: {
            directory: __dirname + '/database/migrations',
            tableName: 'migrations'
        }
    });

    return db.migrate
        .currentVersion() // this needs to be called to ensure migrations table has been created
        .then(() => db.migrate.status())
        .then(status => {
            if (status !== 0) {
                process.stdout.write(chalk.blue('Updating database ...'));
                return db.migrate.latest()
                    .then(() => {
                        process.stdout.write(chalk.green(' [ok]\n'));
                    }, err => {
                        process.stdout.write(chalk.red(' [error]\n'));
                        throw err;
                    });
            }
        })
        .then(() => {
            return db;
        });
};

const installSkeleton = async () => {
    const target = process.env.AVANTI_PATH || '/opt/avanti';
    return new Promise((resolve) => {
        fs.access(target, fs.R_OK, async (err) => {
            if (err) {
                process.stdout.write(chalk.blue('Copy skeleton ...'));
                try {

                    // create folder
                    await mkdirp(path.dirname(target));

                    // copy skeleton
                    const skeleton = path.dirname(__dirname) + '/skeleton';
                    await exec('cp -r {{skeleton}} {{target}}', { skeleton, target });

                } catch(err) {
                    process.stdout.write(chalk.red(' [error]\n'));
                    throw err;
                }
                process.stdout.write(chalk.green(' [ok]\n'));
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
