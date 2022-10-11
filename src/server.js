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
        try {
            var hosts = await Host.list()
            hosts = hosts.length
        } catch (error) {
            hosts = 0
        }

        // apache2 version
        try {
            var apache2Version = await exec("apache2 -v | grep version | cut -d' ' -f3")
            apache2Version = apache2Version.trim()
        } catch (error) {
            if (error.code === 127) {
                nodejsVersion = 'Package not found'
            } else {
                nodejsVersion = 'Package not found'
            }
        }

        // nodejs version
        try {
            var nodejsVersion = await exec('node -v');
            nodejsVersion = nodejsVersion.trim()
        } catch (error) {
            if (error.code === 127) {
                nodejsVersion = 'Package not found'
            } else {
                nodejsVersion = 'Package not found'
            }
        }

        // npm version
        try {
            var npmVersion = await exec('npm -v')
            npmVersion = npmVersion.trim()
        } catch (error) {
            if (error.code === 127) {
                npmVersion = 'Package not found'
            } else {
                npmVersion = 'Package not found'
            }
        }
        // ubuntu version
        try {
            var ubuntuVersion = await exec('lsb_release -d')
            ubuntuVersion = ubuntuVersion.replace('Description:', '').trim()
        } catch (error) {
            ubuntuVersion = 'Couldnt get OS Version'
        }

        // get list of Phpversions
        try {
            var phpVersions = await PHP.versions()
        } catch (error) {
            phpVersions = []
        }

        // avanti version
        try {
            var avantiCoreVersion = require(__dirname + '/../../avanti-core/package.json').version
        } catch (error) {
            avantiCoreVersion = error.code
        }

        try {
            var avantiCliVersion = require(__dirname + '/../../avanti-cli/package.json').version
        } catch (error) {
            avantiCliVersion = error.code
        }

        try {
            var avantiApiVersion = require(__dirname + '/../../avanti-api/package.json').version
        } catch (error) {
            avantiApiVersion = error.code
        }

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
