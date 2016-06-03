var exec = require('./exec.js');

module.exports = {
    stop: function() {
        return exec('service apache2 stop');
    },

    start: function() {
        return exec('service apache2 start');
    },

    restart: function() {
        return exec('service apache2 restart');
    },

    testConfig: function() {
        return exec('apachectl configtest');
    }
};
