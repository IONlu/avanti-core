'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exec = require('../exec.js');

var _exec2 = _interopRequireDefault(_exec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const stop = (() => {
  var _ref = _asyncToGenerator(function* () {
    return (0, _exec2.default)('service php7.0-fpm stop');
  });

  return function stop() {
    return _ref.apply(this, arguments);
  };
})();
const start = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    return (0, _exec2.default)('service php7.0-fpm start');
  });

  return function start() {
    return _ref2.apply(this, arguments);
  };
})();
const restart = (() => {
  var _ref3 = _asyncToGenerator(function* () {
    return (0, _exec2.default)('service php7.0-fpm restart');
  });

  return function restart() {
    return _ref3.apply(this, arguments);
  };
})();

exports.default = { stop: stop, start: start, restart: restart };