import globby from 'globby';
import path from 'path';

export const versions = async () => {
    const folders = await globby('/etc/php/*');
    return folders.map(folder => path.basename(folder));
};
