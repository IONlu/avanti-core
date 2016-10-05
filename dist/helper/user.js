'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.remove = exports.create = exports.exists = exports.home = undefined;

var _exec = require('./exec.js');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const home = (() => {
    var _ref = _asyncToGenerator(function* (name) {
        return yield (0, _exec2.default)('eval echo ~{{name}}', { name: name });
    });

    return function home(_x) {
        return _ref.apply(this, arguments);
    };
})();

const exists = (() => {
    var _ref2 = _asyncToGenerator(function* (name) {
        return !!(yield (0, _exec2.default)('id -u {{name}} 2> /dev/null', { name: name }));
    });

    return function exists(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const create = (() => {
    var _ref3 = _asyncToGenerator(function* (name) {
        if (!(yield exists(name))) {
            yield (0, _exec2.default)('useradd --home-dir /var/www/{{name}} --shell /bin/false {{name}}', { name: name });
        }
    });

    return function create(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

const remove = (() => {
    var _ref4 = _asyncToGenerator(function* (name, backupFolder) {
        const homeFolder = yield home(name);

        if (backupFolder) {
            yield (0, _exec2.default)('mkdir -p {{backupFolder}}', { backupFolder: backupFolder });

            // generate a compressed backup of the customer's home folder and then remove the home folder
            yield (0, _exec2.default)('deluser --backup --backup-to {{backupFolder}} --remove-home {{name}}', { name: name, backupFolder: backupFolder });
        } else {
            yield (0, _exec2.default)('deluser --backup --remove-home {{name}}', { name: name });
        }

        // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
        yield (0, _exec2.default)('rm -fr {{homeFolder}}', { homeFolder: homeFolder });
    });

    return function remove(_x4, _x5) {
        return _ref4.apply(this, arguments);
    };
})();

exports.home = home;
exports.exists = exists;
exports.create = create;
exports.remove = remove;