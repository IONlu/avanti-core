import { Iconv } from 'iconv';

// removes special chars
const convert = (name, allowedChars) => {
    allowedChars = allowedChars || '-a-z0-9_';

    let iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE');
    return iconv.convert(name).toString()
                .toLowerCase()
                .replace(new RegExp('[^' + allowedChars + ']', 'g'), '')
                .replace(/^[0-9]+/g, '')
                .substr(0, 32);
};

export default convert;
