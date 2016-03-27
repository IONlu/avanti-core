var Promise = require('bluebird'),
    spawn = require('child_process').spawn;

spawn = Promise.promisify(spawn);

function replacePlaceholders(params, string) {
    return string.replace(/\{\{([a-z0-9_]+)\}\}/ig, function(match, key) {
        if (!params[key] || !params[key].length)
            throw 'exec: "' + key + '" is missing or empty';
        return params[key];
    });
}

module.exports = function(command, params) {
    // split string on not escaped whitespaces
    var args = command.split(/(?<!\\) +/)
        // replace placeholders
        .map(replacePlaceholders.bind(this, params));

    // first argument is the command
    var command = args.shift(args);

    return spawn(command, args);
}
