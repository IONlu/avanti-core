'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});

var _iconv = require('iconv');

// removes special chars
const convert = (name, allowedChars) => {
            allowedChars = allowedChars || '-a-z0-9_';

            let iconv = new _iconv.Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE');
            return iconv.convert(name).toString().toLowerCase().replace(new RegExp('[^' + allowedChars + ']', 'g'), '').replace(/^[0-9]+/g, '').substr(0, 32);
};

exports.default = convert;