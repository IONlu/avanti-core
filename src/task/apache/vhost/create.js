import { create, exists } from '../../../utils/file'

export const run = async ({ hostname, data }) => {
    let mainFile = `/etc/apache2/sites-available/${hostname}.conf`
    let customFile = `/etc/apache2/avanti/${hostname}.conf`

    return Promise.all([
        create(mainFile, data),
        exists(customFile)
            .then(exists => {
                if (!exists) {
                    create(customFile)
                }
            })
    ]);
};
