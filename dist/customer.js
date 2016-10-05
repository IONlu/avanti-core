'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _exec = require('./exec.js');

var _exec2 = _interopRequireDefault(_exec);

var _host = require('./host.js');

var _host2 = _interopRequireDefault(_host);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// private functions

const createHomeFolder = (() => {
    var _ref = _asyncToGenerator(function* (name) {
        yield (0, _exec2.default)('mkdir -p /var/www/{{name}}', { name: name });
        yield (0, _exec2.default)('chown -R {{name}}:{{name}} /var/www/{{name}}', { name: name });
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

// customer class

class Customer {
    constructor(name) {
        if (name.length > 32 || !name.match(/^[a-z][-a-z0-9_]*$/)) {
            throw `invalid customer name "${ name }"`;
        }
        this.name = name;
        this.hostnames = {};
    }

    create() {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield (0, _exec2.default)('useradd --home-dir /var/www/{{name}} --shell /bin/false {{name}}', {
                name: _this.name
            });
            yield createHomeFolder(_this.name);
        })();
    }

    remove() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield createBackupFolder(_this2.name);

            // generate a compressed backup of the customer's home folder and then remove the home folder
            yield (0, _exec2.default)('deluser --backup --backup-to /var/backup-www/{{name}} --remove-home {{name}}', {
                name: _this2.name
            });

            // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
            yield removeHomeFolder(_this2.name);
        })();
    }

    addHost(hostname) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield new _host2.default(_this3, hostname).create();
        })();
    }

    removeHost(hostname) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield new _host2.default(_this4, hostname).remove();
        })();
    }
}

exports.default = Customer;