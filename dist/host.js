'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exec = require('./exec.js');

var _exec2 = _interopRequireDefault(_exec);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _pool = require('./pool.js');

var _pool2 = _interopRequireDefault(_pool);

var _Apache = require('./service/Apache.js');

var _Apache2 = _interopRequireDefault(_Apache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);
const readFile = _bluebird2.default.promisify(_fs2.default.readFile);
const unlink = _bluebird2.default.promisify(_fs2.default.unlink);

const enableVhost = (() => {
    var _ref = _asyncToGenerator(function* (hostname) {
        yield (0, _exec2.default)('a2ensite {{hostname}}', { hostname: hostname });
    });

    return function enableVhost(_x) {
        return _ref.apply(this, arguments);
    };
})();

const disableVhost = (() => {
    var _ref2 = _asyncToGenerator(function* (hostname) {
        yield (0, _exec2.default)('a2dissite {{hostname}}', { hostname: hostname });
    });

    return function disableVhost(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

const createVhostFile = (() => {
    var _ref3 = _asyncToGenerator(function* (hostname, data) {
        yield writeFile(`/etc/apache2/sites-available/${ hostname }.conf`, data);
    });

    return function createVhostFile(_x3, _x4) {
        return _ref3.apply(this, arguments);
    };
})();

const removeVhostFile = (() => {
    var _ref4 = _asyncToGenerator(function* (hostname) {
        yield unlink(`/etc/apache2/sites-available/${ hostname }.conf`);
    });

    return function removeVhostFile(_x5) {
        return _ref4.apply(this, arguments);
    };
})();

const createVhostFolder = (() => {
    var _ref5 = _asyncToGenerator(function* (customer, name) {
        yield (0, _exec2.default)('mkdir -p /var/www/{{customer}}/{{name}}', { name: name, customer: customer });
        yield (0, _exec2.default)('chown -R {{customer}}:{{customer}} /var/www/{{customer}}/{{name}}', { name: name, customer: customer });
    });

    return function createVhostFolder(_x6, _x7) {
        return _ref5.apply(this, arguments);
    };
})();

const removeVhostFolder = (() => {
    var _ref6 = _asyncToGenerator(function* (customer, name) {
        yield (0, _exec2.default)('rm -fr /var/www/{{customer}}/{{name}}', { name: name, customer: customer });
    });

    return function removeVhostFolder(_x8, _x9) {
        return _ref6.apply(this, arguments);
    };
})();

const addPool = (() => {
    var _ref7 = _asyncToGenerator(function* (host) {
        yield new _pool2.default(host).create();
    });

    return function addPool(_x10) {
        return _ref7.apply(this, arguments);
    };
})();

const removePool = (() => {
    var _ref8 = _asyncToGenerator(function* (host) {
        yield new _pool2.default(host).remove();
    });

    return function removePool(_x11) {
        return _ref8.apply(this, arguments);
    };
})();

// load and compile vhost template
const loadTemplate = readFile(__dirname + '/templates/vhost.hbs', 'utf-8').then(function (template) {
    return _handlebars2.default.compile(template);
});

class Host {
    constructor(customer, name) {
        this.customer = customer;
        this.name = name;
    }

    create() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let template = yield loadTemplate;
            let data = template(_this);
            yield createVhostFile(_this.name, data);
            yield createVhostFolder(_this.customer.name, _this.name);
            yield enableVhost(_this.name);
            yield addPool(_this);
            yield _Apache2.default.restart();
        })();
    }

    remove() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield disableVhost(_this2.name);
            yield removeVhostFile(_this2.name);
            yield removeVhostFolder(_this2.customer.name, _this2.name);
            yield removePool(_this2);
            yield _Apache2.default.restart();
        })();
    }
}

exports.default = Host;