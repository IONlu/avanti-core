import mkdirp from 'mkdirp';
import Registry from './registry';
import Config from './config';
import path from 'path';
import fs from 'fs';
import exec from './exec';
import { init as initLog } from './log';
import chalk from 'chalk';
import Knex from 'knex';
import dotenv from 'dotenv';

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

const installSkeleton = async (target) => {
    return new Promise((resolve, reject) => {
        fs.readdir(target, async (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            if (!files.length) {
                process.stdout.write(chalk.blue('Copy skeleton ...'));
                try {
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

export default async () => {
    // create target folder
    const target = process.env.AVANTI_PATH || '/opt/avanti';
    await mkdirp(target);

    // init logger
    await initLog(target);

    // check if executed as root
    if (process.getuid() !== 0) {
        throw new Error('Avanti needs root privileges');
    }

    // install skeleton
    await installSkeleton(target);

    // init dotenv
    dotenv.config({
        path: target + '/.env'
    });

    // load config
    Registry.set('Config', new Config(target + '/config.json'));

    // init singletons
    Registry.set('Database', await initDatabase(target));

};
