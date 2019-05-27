import { create } from '../../utils/file'

export const run = async ({ data }) => {
    let file = `/etc/proftpd/ftpd.passwd`

    return create(file, data);
};
