'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _exec = require('./exec.js');

var _exec2 = _interopRequireDefault(_exec);

var _host = require('./host.js');

var _host2 = _interopRequireDefault(_host);

var _user = require('./helper/user.js');

var User = _interopRequireWildcard(_user);

var _registry = require('./registry.js');

var _registry2 = _interopRequireDefault(_registry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// private functions

const createHomeFolder = (() => {
    var _ref = _asyncToGenerator(function* (name) {
        yield (0, _exec2.default)('mkdir -p /var/www/{{name}}', { name: name });
        yield (0, _exec2.default)('chown -R {{name}}:{{name}} /var/www/{{name}}', { name: name });
        return `/var/www/${ name }`;
    });

    return function createHomeFolder(_x) {
        return _ref.apply(this, arguments);
    };
})();

const createBackupFolder = (() => {
    var _ref2 = _asyncToGenerator(function* (name) {
        yield (0, _exec2.default)('mkdir -p /var/backup-www/{{name}}', { name: name });
    });

    return function createBackupFolder(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const removeHomeFolder = (() => {
    var _ref3 = _asyncToGenerator(function* (name) {
        yield (0, _exec2.default)('rm -fr /var/www/{{name}}', { name: name });
    });

    return function removeHomeFolder(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

// client class

class Client {
    constructor(name) {
        this.name = name;
        this.hostnames = {};
        this.db = _registry2.default.get('Database');
    }

    exists() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let result = yield _this.db.get(`
            SELECT "client"
            FROM "client"
            WHERE "client" = :client
            LIMIT 1
        `, {
                ':client': _this.name
            });
            return result && result.client;
        })();
    }

    create() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            if (yield _this2.exists()) {
                return;
            }

            // find free username
            const convertedUser = yield User.convert(_this2.name);
            var user = convertedUser;
            var index = 0;
            while (yield User.exists(user)) {
                index++;
                user = User.renumber(convertedUser, index);
            }

            yield User.create(user);
            const home = yield createHomeFolder(user);

            yield _this2.db.run(`
            INSERT
            INTO "client"
              ("client", "user", "path")
            VALUES
              (:client, :user, :path)
        `, {
                ':client': _this2.name,
                ':user': user,
                ':path': home
            });
        })();
    }

    remove() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield createBackupFolder(_this3.name);

            // generate a compressed backup of the client's home folder and then remove the home folder
            yield (0, _exec2.default)('deluser --backup --backup-to /var/backup-www/{{name}} --remove-home {{name}}', {
                name: _this3.name
            });

            // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
            yield removeHomeFolder(_this3.name);
        })();
    }

    addHost(hostname) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield new _host2.default(_this4, hostname).create();
        })();
    }

    removeHost(hostname) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield new _host2.default(_this5, hostname).remove();
        })();
    }
}

exports.default = Client;