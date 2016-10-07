'use strict';

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

(0, _setup2.default)().then(() => {

    _commander2.default.version(_package2.default.version);

    _commander2.default.command('client <action> <client>').action(function (action, client) {
        Client[action](client);
    });

    _commander2.default.command('host <action> <client> <hostname>').action(function (action, client, hostname) {
        Host[action](client, hostname);
    });

    _commander2.default.parse(process.argv);
});