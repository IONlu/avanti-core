import Promise from 'bluebird';
import { exec } from 'child_process';

const execPromise = Promise.promisify(exec);

function escapeString(string) {
    return string.replace(/[^\\](['"])/g, (match, quote) => match.slice(0, 1) + '\\' + quote);
}

function replacePlaceholders(string, params) {
    return string.replace(/\{\{([a-z0-9_]+)\}\}/ig, (match, key) => {
        if (!params[key] || !params[key].length) {
            throw 'exec: "' + key + '" is missing or empty';
        }
        return escapeString(params[key]);
    });
}

export default async (command, params) => execPromise(replacePlaceholders(command, params || {}));
