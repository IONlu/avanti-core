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

var _database = require('./database.js');

var _database2 = _interopRequireDefault(_database);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exec = require('./exec.js');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const initDatabase = (() => {
    var _ref = _asyncToGenerator(function* () {
        return new Promise(function (resolve) {
            let db = new _sqlite2.default.Database('/opt/avanti/db.sqlite3');
            let database = new _database2.default(db);
            database.run(`
            CREATE TABLE IF NOT EXISTS "client" (
              "client" VARCHAR(100) NOT NULL,
              "user" VARCHAR(100) NOT NULL,
              "path" VARCHAR(200) NOT NULL,
              PRIMARY KEY ("client"));
        `).then(function () {
                return database.run(`
            CREATE TABLE IF NOT EXISTS "host" (
              "host" VARCHAR(100) NOT NULL,
              "client" VARCHAR(100) NOT NULL,
              "user" VARCHAR(100) NOT NULL,
              "path" VARCHAR(200) NOT NULL,
              PRIMARY KEY ("host"));
        `).then(function () {
                    return resolve(database);
                });
            });
        });
    });

    return function initDatabase() {
        return _ref.apply(this, arguments);
    };
})();

const installSkeleton = (() => {
    var _ref2 = _asyncToGenerator(function* (target) {
        return new Promise(function (resolve) {
            _fs2.default.access(target, _fs2.default.R_OK, (() => {
                var _ref3 = _asyncToGenerator(function* (err) {
                    if (err) {
                        // create folder
                        yield (0, _mkdirp2.default)(_path2.default.dirname(target));

                        // copy skeleton
                        const skeleton = _path2.default.dirname(__dirname) + '/skeleton';
                        yield (0, _exec2.default)('cp -r {{skeleton}} {{target}}', { skeleton: skeleton, target: target });

                        resolve();
                    }
                });

                return function (_x2) {
                    return _ref3.apply(this, arguments);
                };
            })());
        });
    });

    return function installSkeleton(_x) {
        return _ref2.apply(this, arguments);
    };
})();

exports.default = (() => {
    var _ref4 = _asyncToGenerator(function* (target) {

        // install skeleton
        yield installSkeleton(target);

        // load config
        _registry2.default.set('Config', new _config2.default(target + '/config.json'));

        // init singletons
        _registry2.default.set('Database', (yield initDatabase()));
    });

    return function (_x3) {
        return _ref4.apply(this, arguments);
    };
})();