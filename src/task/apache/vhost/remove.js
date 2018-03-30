import { remove } from '../../../utils/file'

export const run = async ({ hostname }) => {
    let mainFile = `/etc/apache2/sites-available/${hostname}.conf`
    let customFile = `/etc/apache2/avanti/${hostname}.conf`
    
    return Promise.all([
        remove(customFile),
        remove(mainFile)
    ])
};
