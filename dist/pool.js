'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Fpm = require('./service/Fpm.js');

var _Fpm2 = _interopRequireDefault(_Fpm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
const unlink = _bluebird2.default.promisify(_fs2.default.unlink);

const createPoolFile = (() => {
    var _ref = _asyncToGenerator(function* (hostname, data) {
        yield writeFile(`/etc/php/7.0/fpm/pool.d/${ hostname }.conf`, data);
    });

    return function createPoolFile(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

const removePoolFile = (() => {
    var _ref2 = _asyncToGenerator(function* (hostname) {
        yield unlink(`/etc/php/7.0/fpm/pool.d/${ hostname }.conf`);
    });

    return function removePoolFile(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

class Pool {
    constructor(host) {
        this.host = host;
    }

    create() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const hostInfo = yield _this.host.info();

            const data = _ini2.default.encode({
                user: hostInfo.user,
                group: hostInfo.user,
                listen: `/run/php/${ hostInfo.user }.sock`,
                'listen.owner': 'www-data',
                'listen.group': 'www-data',
                pm: 'dynamic',
                'pm.max_children': 6,
                'pm.start_servers': 1,
                'pm.min_spare_servers': 1,
                'pm.max_spare_servers': 3,
                'php_admin_value[open_basedir]': `${ hostInfo.path }`,
                'php_admin_value[session.save_path]': `${ hostInfo.path }/sessions`,
                'php_admin_value[disable_functions]': 'exec,mail,passthru,popen,proc_open,show_source,shell,shell_exec,symlink,system,phpinfo',
                'php_admin_value[sendmail_path]': `/usr/sbin/sendmail -t -i -f webmaster@${ _this.host.name } `
            }, {
                section: _this.host.name
            });
            yield createPoolFile(_this.host.name, data);
            yield _Fpm2.default.restart();
        })();
    }

    remove() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield removePoolFile(_this2.host.name);
            yield _Fpm2.default.restart();
        })();
    }
}

exports.default = Pool;