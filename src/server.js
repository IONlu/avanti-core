import exec from './exec.js';
import Registry from './registry.js';
import Host from './host.js';
import * as PHP from './helper/php';

// server class
class Server {
    constructor() {
        this.db = Registry.get('Database');
        this.config = Registry.get('Config');
    }

    async info() {
        // get host list
        var hosts = await Host.list()
        hosts = hosts.length

        // apache2 version
        let apache2Version = await exec("apache2 -v | grep version | cut -d' ' -f3")
        apache2Version = apache2Version.trim()
        // nodejs version
        let nodejsVersion = await exec('node -v');
        nodejsVersion = nodejsVersion.trim()

        // npm version
        let npmVersion = await exec('npm -v');
        npmVersion = npmVersion.trim()

        // ubuntu version
        let ubuntuVersion = await exec('lsb_release -d')
        ubuntuVersion = ubuntuVersion.replace('Description:', '').trim()

        // get list of Phpversions
        let phpVersions = await PHP.versions()

        // avanti version
        var avantiCoreVersion = require(__dirname + '/../../avanti-core/package.json').version
        var avantiCliVersion = require(__dirname + '/../../avanti-cli/package.json').version
        var avantiApiVersion = require(__dirname + '/../../avanti-api/package.json').version

        return {
          nodejsVersion,
          hosts,
          ubuntuVersion,
          avantiCoreVersion,
          avantiCliVersion,
          avantiApiVersion,
          npmVersion,
          apache2Version,
          phpVersions
        }
    }
};

export default Server;
