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
        yield (0, _exec2.default)('mkdir -p /var/www/vhost/{{name}}', { name: name });
        yield (0, _exec2.default)('chown -R {{name}}:{{name}} /var/www/{{name}}', { name: name });
        return `/var/www/${ name }`;
    });

    return function createHomeFolder(_x) {
        return _ref.apply(this, arguments);
    };
})();

// client class

class Client {
    constructor(name) {
        this.name = name;
        this.hostnames = {};
        this.db = _registry2.default.get('Database');
    }

    info() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let result = yield _this.db.get(`
            SELECT *
            FROM "client"
            WHERE "client" = :client
            LIMIT 1
        `, {
                ':client': _this.name
            });
            return result;
        })();
    }

    exists() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            return !!(yield _this2.info());
        })();
    }

    create() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            if (yield _this3.exists()) {
                return;
            }

            // find free username
            const user = yield User.free(_this3.name);

            yield User.create(user);
            const home = yield createHomeFolder(user);

            yield _this3.db.run(`
            INSERT
            INTO "client"
              ("client", "user", "path")
            VALUES
              (:client, :user, :path)
        `, {
                ':client': _this3.name,
                ':user': user,
                ':path': home
            });
        })();
    }

    remove() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const info = yield _this4.info();
            if (!info) {
                return;
            }

            yield _this4.db.run(`
            DELETE
            FROM "client"
            WHERE "client" = :client
        `, {
                ':client': _this4.name
            });

            console.warn('TODO: delete all hosts for this user');

            yield User.remove(info.user, `/var/www/backup/${ info.user }`);
        })();
    }

    addHost(hostname) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield new _host2.default(_this5, hostname).create();
        })();
    }

    removeHost(hostname) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield new _host2.default(_this6, hostname).remove();
        })();
    }
}

exports.default = Client;