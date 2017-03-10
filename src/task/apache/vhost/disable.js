import exec from '../../../exec.js';
import { Warning } from '../../../task';

export const run = async ({ hostname }) => {
    try {
        return await exec('a2dissite {{hostname}}', { hostname });
    } catch (err) {
        if (err.code === 1) {
            throw new Warning(err.message);
        }
        throw err;
    }
};
