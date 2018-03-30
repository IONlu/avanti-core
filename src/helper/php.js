import globby from 'globby';
import path from 'path';
import semver from 'semver';

export const versions = async () => {
    const folders = await globby('/etc/php/*', {
        onlyFiles: false,
        onlyDirectories: true
    });
    if (!folders.length) {
        throw new Error('No PHP version found');
    }
    return folders.map(folder => path.basename(folder));
};

export const latest = async () => {
    return (await versions())
        .sort((a, b) => semver.rcompare(a + '.0', b + '.0')).shift();
};

export const available = async (php) => {
    return (await versions())
        .indexOf(php) > -1;
};
