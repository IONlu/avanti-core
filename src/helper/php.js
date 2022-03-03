import semver from 'semver';
import exec from '../exec.js';

export const versions = async () => {
    let phpversions = await exec("dpkg --list | grep '^ii' | grep -i fpm | grep -i php | awk -F' ' '{ print $2 }' | sed 's#\php##g' | sed 's#\-fpm##g'")
    phpversions = phpversions.split('\n').filter((val) => !!val)
    if (!phpversions.length) {
        throw new Error('No PHP version found');
    }
    return phpversions
};

export const latest = async () => {
    return (await versions())
        .sort((a, b) => semver.rcompare(a + '.0', b + '.0')).shift();
};

export const available = async (php) => {
    return (await versions())
        .indexOf(php) > -1;
};
