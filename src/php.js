import * as PHP from './helper/php';

class Php {
    async phpVersions() {

        let output = await PHP.versions()
        return output
    }
}

export default Php;
