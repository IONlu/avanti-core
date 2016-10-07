'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _sqlite = require('sqlite3');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _registry = require('./registry.js');

var _registry2 = _interopRequireDefault(_registry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const initSqlite = (() => {
    var _ref = _asyncToGenerator(function* () {
        var db = new _sqlite2.default.Database('/opt/avanti/db.sqlite3');
        return new Promise(function (resolve) {
            db.serialize();
            resolve(db);
        });
    });

    return function initSqlite() {
        return _ref.apply(this, arguments);
    };
})();

exports.default = _asyncToGenerator(function* () {

    // create folder
    yield (0, _mkdirp2.default)('/opt/avanti');

    // init singletons
    _registry2.default.set('Database', (yield initSqlite()));
});