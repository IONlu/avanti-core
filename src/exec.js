var Promise = require('bluebird'),
    exec = require('child_process').exec;

exec = Promise.promisify(exec);

function escapeString(string) {
    return string.replace(/[^\\](['"])/g, function(match, quote) {
        return m.slice(0, 1) + '\\' + quote;
    });
}

function replacePlaceholders(string, params) {
    return string.replace(/\{\{([a-z0-9_]+)\}\}/ig, function(match, key) {
        if (!params[key] || !params[key].length)
            throw 'exec: "' + key + '" is missing or empty';
        return escapeString(params[key]);
    });
}

module.exports = function(command, params) {
    return exec(replacePlaceholders(command, params));
}
