"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Database {

    constructor(db) {
        this.db = db;
    }

    run(sql, params) {
        var _this = this;

        return _asyncToGenerator(function* () {
            return new Promise(function (resolve, reject) {
                _this.db.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                });
            });
        })();
    }

    get(sql, params) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            return new Promise(function (resolve, reject) {
                _this2.db.get(sql, params, function (err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        })();
    }

    all(sql, params) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            return new Promise(function (resolve, reject) {
                _this3.db.all(sql, params, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        })();
    }

}

exports.default = Database;