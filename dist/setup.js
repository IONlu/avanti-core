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

    return function initDatabase() {
        return _ref.apply(this, arguments);
    };
})();

exports.default = _asyncToGenerator(function* () {

    // create folder
    yield (0, _mkdirp2.default)('/opt/avanti');

    // init singletons
    _registry2.default.set('Database', (yield initDatabase()));
});