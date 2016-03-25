var ini = require('ini');

module.exports = {

    create: function(domain, user)
    {
        var iniString = ini.encode({
            user: user,
            group: user,
            listen: '/run/php/' + domain + '.sock',
            'listen.owner': 'www-data',
            'listen.group': 'www-data',
            pm: 'dynamic',
            'pm.max_children': 5,
            'pm.start_servers': 2,
            'pm.min_spare_servers': 1,
            'pm.max_spare_servers': 3
        }, {
            section: domain
        });
        console.log(iniString);
    }

};
