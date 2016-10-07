'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exec = require('./exec.js');

var _exec2 = _interopRequireDefault(_exec);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _pool = require('./pool.js');

var _pool2 = _interopRequireDefault(_pool);

var _Apache = require('./service/Apache.js');

var _Apache2 = _interopRequireDefault(_Apache);

var _registry = require('./registry.js');

var _registry2 = _interopRequireDefault(_registry);

var _user = require('./helper/user.js');

var User = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
const readFile = _bluebird2.default.promisify(_fs2.default.readFile);
const unlink = _bluebird2.default.promisify(_fs2.default.unlink);

const enableVhost = (() => {
    var _ref = _asyncToGenerator(function* (hostname) {
        yield (0, _exec2.default)('a2ensite {{hostname}}', { hostname: hostname });
    });

    return function enableVhost(_x) {
        return _ref.apply(this, arguments);
    };
})();

const disableVhost = (() => {
    var _ref2 = _asyncToGenerator(function* (hostname) {
        yield (0, _exec2.default)('a2dissite {{hostname}}', { hostname: hostname });
    });

    return function disableVhost(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const createVhostFile = (() => {
    var _ref3 = _asyncToGenerator(function* (hostname, data) {
        yield writeFile(`/etc/apache2/sites-available/${ hostname }.conf`, data);
    });

    return function createVhostFile(_x3, _x4) {
        return _ref3.apply(this, arguments);
    };
})();

const removeVhostFile = (() => {
    var _ref4 = _asyncToGenerator(function* (hostname) {
        yield unlink(`/etc/apache2/sites-available/${ hostname }.conf`);
    });

    return function removeVhostFile(_x5) {
        return _ref4.apply(this, arguments);
    };
})();

const createVhostFolder = (() => {
    var _ref5 = _asyncToGenerator(function* (path, user) {
        yield (0, _exec2.default)('mkdir -p {{path}}', { path: path });
        yield (0, _exec2.default)('mkdir -p {{path}}', { path: path + '/temp' });
        yield (0, _exec2.default)('mkdir -p {{path}}', { path: path + '/logs' });
        yield (0, _exec2.default)('mkdir -p {{path}}', { path: path + '/sessions' });
        yield (0, _exec2.default)('mkdir -p {{path}}', { path: path + '/web' });
        yield (0, _exec2.default)('chown -R {{user}}:{{user}} {{path}}', { path: path, user: user });
    });

    return function createVhostFolder(_x6, _x7) {
        return _ref5.apply(this, arguments);
    };
})();

const removeVhostFolder = (() => {
    var _ref6 = _asyncToGenerator(function* (path) {
        yield (0, _exec2.default)('rm -fr {{path}}', { path: path });
    });

    return function removeVhostFolder(_x8) {
        return _ref6.apply(this, arguments);
    };
})();

const addPool = (() => {
    var _ref7 = _asyncToGenerator(function* (host) {
        yield new _pool2.default(host).create();
    });

    return function addPool(_x9) {
        return _ref7.apply(this, arguments);
    };
})();

const removePool = (() => {
    var _ref8 = _asyncToGenerator(function* (host) {
        yield new _pool2.default(host).remove();
    });

    return function removePool(_x10) {
        return _ref8.apply(this, arguments);
    };
})();

// load and compile vhost template
const loadTemplate = readFile(__dirname + '/templates/vhost.hbs', 'utf-8').then(function (template) {
    return _handlebars2.default.compile(template);
});

class Host {
    constructor(client, name) {
        this.client = client;
        this.name = name;
        this.db = _registry2.default.get('Database');
    }

    info() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let result = yield _this.db.get(`
            SELECT *
            FROM "host"
            WHERE "client" = :client
              AND "host" = :host
            LIMIT 1
        `, {
                ':host': _this.name,
                ':client': _this.client.name
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

            // create user
            const clientInfo = yield _this3.client.info();
            const home = `${ clientInfo.path }/${ user }`;
            yield User.create(user, home);

            const documentRoot = `${ home }/web`;
            let template = yield loadTemplate;
            let data = template(Object.assign(_this3, { user: user, documentRoot: documentRoot }));
            yield createVhostFile(_this3.name, data);
            yield createVhostFolder(home, user);
            yield enableVhost(_this3.name);

            yield _this3.db.run(`
            INSERT
            INTO "host"
              ("host", "client", "user", "path")
            VALUES
              (:host, :client, :user, :path)
        `, {
                ':host': _this3.name,
                ':client': _this3.client.name,
                ':user': user,
                ':path': home
            });

            yield addPool(_this3);

            yield _Apache2.default.restart();
        })();
    }

    remove() {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const info = yield _this4.info();
            if (!info) {
                return;
            }

            yield disableVhost(_this4.name);
            yield removeVhostFile(_this4.name);
            yield removeVhostFolder(info.path);
            yield removePool(_this4);

            yield _this4.db.run(`
            DELETE
            FROM "host"
            WHERE "host" = :host
        `, {
                ':host': _this4.name
            });

            yield _Apache2.default.restart();
        })();
    }
}

exports.default = Host;