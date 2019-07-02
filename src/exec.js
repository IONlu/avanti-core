import { spawn } from 'child_process';

function replacePlaceholders(string, params) {
    return string.replace(/\{\{([a-z0-9_]+)\}\}/ig, (match, key) => {
        if (!params[key] || !params[key].length) {
            throw 'exec: "' + key + '" is missing or empty';
        }
        return params[key];
    });
}

export default async (command, params, stdin, env = {}) => {
    return new Promise((resolve, reject) => {
        let commandParts = command.split(/ +/).map(part => {
            return replacePlaceholders(part, params)
        });
        let result = '';
        let error = '';
        let child = spawn(commandParts[0], commandParts.slice(1), {
            env: {
                ...process.env,
                ...env
            }
        });
        child.on('error', reject);
        child.stderr.on('data', data => error += data);
        child.stdout.on('data', data => result += data);
        child.on('exit', code => {
            if (code === 0) {
                resolve(result);
            } else {
                let err;
                if (code === 3) {
                    err = new Error('Service is not running/installed');
                } else {
                    err = new Error('Unknown error');
                }
                err.code = code;
                reject(err);
            }
        });
        if (stdin) {
            child.stdin.write(stdin + '\n');
            child.stdin.end();
        }
    });
};
