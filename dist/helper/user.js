'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.free = exports.remove = exports.create = exports.exists = exports.home = exports.renumber = exports.convert = exports.validate = undefined;

var _convert = require('./convert.js');

var _convert2 = _interopRequireDefault(_convert);

var _exec = require('../exec.js');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// validates user name format for ubuntu
const validate = name => {
    return name.length <= 32 && name.match(/^[a-z][-a-z0-9_]*$/);
};

// adds a number to the username
const renumber = (name, number) => {
    number = '' + number;
    var combinedLength = name.length + number.length;
    if (combinedLength > 32) {
        name = name.substr(0, name.length - (combinedLength - 32));
    }
    return name + number;
};

// returns users home folder
const home = (() => {
    var _ref = _asyncToGenerator(function* (name) {
        return yield (0, _exec2.default)('eval echo ~{{name}}', { name: name });
    });

    return function home(_x) {
        return _ref.apply(this, arguments);
    };
})();

// checks if user exists
const exists = (() => {
    var _ref2 = _asyncToGenerator(function* (name) {
        try {
            yield (0, _exec2.default)('id -u {{name}} 2> /dev/null', { name: name });
            return true;
        } catch (e) {
            return false;
        }
    });

    return function exists(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

// creates a user if valid
const create = (() => {
    var _ref3 = _asyncToGenerator(function* (name, home) {
        if (!validate(name)) {
            throw 'invalid username "' + name + '"';
        }
        if (!(yield exists(name))) {
            yield (0, _exec2.default)('useradd --home-dir {{home}} --shell /bin/false {{name}}', { name: name, home: home });
        }
    });

    return function create(_x3, _x4) {
        return _ref3.apply(this, arguments);
    };
})();

// removes a user if exists
const remove = (() => {
    var _ref4 = _asyncToGenerator(function* (name, backupFolder) {
        if (!(yield exists(name))) {
            return;
        }

        const homeFolder = yield home(name);

        if (backupFolder) {
            yield (0, _exec2.default)('mkdir -p {{backupFolder}}', { backupFolder: backupFolder });

            // generate a compressed backup of the client's home folder and then remove the home folder
            yield (0, _exec2.default)('deluser --backup --backup-to {{backupFolder}} --remove-home {{name}}', { name: name, backupFolder: backupFolder });
        } else {
            yield (0, _exec2.default)('deluser --backup --remove-home {{name}}', { name: name });
        }

        // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
        yield (0, _exec2.default)('rm -fr {{homeFolder}}', { homeFolder: homeFolder });
    });

    return function remove(_x5, _x6) {
        return _ref4.apply(this, arguments);
    };
})();

// returns a valid free user based on name
const free = (() => {
    var _ref5 = _asyncToGenerator(function* (name) {
        const validUser = yield (0, _convert2.default)(name);
        var freeUser = validUser;
        var index = 0;
        while (yield exists(freeUser)) {
            index++;
            freeUser = renumber(validUser, index);
        }
        return freeUser;
    });

    return function free(_x7) {
        return _ref5.apply(this, arguments);
    };
})();

exports.validate = validate;
exports.convert = _convert2.default;
exports.renumber = renumber;
exports.home = home;
exports.exists = exists;
exports.create = create;
exports.remove = remove;
exports.free = free;