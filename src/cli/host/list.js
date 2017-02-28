import Host from '../../host.js';
import chalk from 'chalk';
import pad from 'pad';

export const execute = async () => {
    try {
        var hosts = await Host.all();
        var hostLength = hosts.reduce((a, b) => Math.max(a, b.host.length), 0);
        var userLength = hosts.reduce((a, b) => Math.max(a, b.user.length), 0);
        var pathLength = hosts.reduce((a, b) => Math.max(a, b.path.length), 0);
        process.stdout.write(hosts.map(host => {
            return pad(host.host, hostLength)
                + '  ' + pad(host.user, userLength)
                + '  ' + pad(host.path, pathLength)
                + '  ' + host.client;
        }).join('\n') + '\n');
    } catch(e) {
        process.exitCode = 1;
        process.stderr.write(chalk.red(chalk.bold('ERROR:') + ' ' + e) + '\n');
    }
};
