'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _setup = require('./setup.js');

var _setup2 = _interopRequireDefault(_setup);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _client = require('./cli/client.js');

var Client = _interopRequireWildcard(_client);

var _host = require('./cli/host.js');

var Host = _interopRequireWildcard(_host);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {

    if (process.getuid() !== 0) {
        throw 'Avanti needs root privileges';
    }

    (0, _setup2.default)('/opt/avanti').then(() => {

        _commander2.default.version(_package2.default.version);

        _commander2.default.command('create-client <client>').action(function (client) {
            Client['create'](client);
        });

        _commander2.default.command('create-host <client> <hostname>').action(function (client, hostname) {
            Host['create'](client, hostname);
        });

        _commander2.default.command('remove-client <client>').action(function (client) {
            Client['remove'](client);
        });

        _commander2.default.command('remove-host <client> <hostname>').action(function (client, hostname) {
            Host['remove'](client, hostname);
        });

        _commander2.default.parse(process.argv);
    });
} catch (e) {

    process.exitCode = 1;
    process.stderr.write(_chalk2.default.red(_chalk2.default.bold('ERROR:') + ' ' + e) + '\n');
}