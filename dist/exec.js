'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const execPromise = _bluebird2.default.promisify(_child_process.exec);

function escapeString(string) {
    return string.replace(/[^\\](['"])/g, (match, quote) => match.slice(0, 1) + '\\' + quote);
}

function replacePlaceholders(string, params) {
    return string.replace(/\{\{([a-z0-9_]+)\}\}/ig, (match, key) => {
        if (!params[key] || !params[key].length) {
            throw 'exec: "' + key + '" is missing or empty';
        }
        return escapeString(params[key]);
    });
}

exports.default = (() => {
    var _ref = _asyncToGenerator(function* (command, params) {
        return execPromise(replacePlaceholders(command, params || {}));
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();