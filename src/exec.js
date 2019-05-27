import { spawn } from 'child_process';

function replacePlaceholders(string, params) {
    return string.replace(/\{\{([a-z0-9_]+)\}\}/ig, (match, key) => {
        if (!params[key] || !params[key].length) {
            throw 'exec: "' + key + '" is missing or empty';
        }
        return params[key];
    });
}

export default async (command, params, stdin) => {
    return new Promise((resolve, reject) => {
        let commandParts = command.split(/ +/).map(part => {
            return replacePlaceholders(part, params)
        });
        let result = '';
        let error = '';
        let child = spawn(commandParts[0], commandParts.slice(1));
        child.on('error', reject);
        child.stderr.on('data', data => error += data);
        child.stdout.on('data', data => result += data);
        child.on('exit', code => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        if (stdin) {
            child.stdin.write(stdin + '\n');
            child.stdin.end();
        }
    });
};
