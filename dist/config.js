'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

const get = function get(object, property) {
    if (typeof object !== 'object') {
        throw 'Invalid config object';
    }

    var _property$split = property.split('.', 2);

    var _property$split2 = _slicedToArray(_property$split, 2);

    const key = _property$split2[0];
    const propertyPart = _property$split2[1];


    if (!object[key]) {
        throw `Config key "${ key }" missing`;
    }

    if (!propertyPart) {
        return object[key];
    }

    return get(object[key], propertyPart);
};

class Config {

    constructor(file) {
        this.data = require(file);
    }

    get(key) {
        return get(this.data, key);
    }

}

exports.default = Config;