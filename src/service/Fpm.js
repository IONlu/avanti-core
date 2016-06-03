var exec = require('./exec.js');

module.exports = {
    stop: function() {
        return exec('service php7.0-fpm stop');
    },

    start: function() {
        return exec('service php7.0-fpm start');
    },

    restart: function() {
        return exec('service php7.0-fpm restart');
    }
};
