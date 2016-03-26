var Promise = require('bluebird'),
    cp = require('child_process'),
    escapeArg = require('phpjs').escapeshellarg;

Promise.promisifyAll(cp);

function prepareCommand(command, params) {
    return command.replace(/\{\{([a-z0-9_]+)\}\}/i, function(match, key) {
        if (!params[key] || !params[key].length)
            throw 'exec: "' + key + '" is missing or empty';
        return escapeArg(params[key]);
    });
}

module.exports = function(command, params) {
    return cp.execAsync(prepareCommand(command, params));
}
