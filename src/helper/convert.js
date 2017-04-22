import { Iconv } from 'iconv';

// removes special chars
//
// 3 type options for cases where the start of name is a number
// - C = client (default) adds a letter "c" in front of the username
// - H = host, adds the letter "h" to the front of the username
// - F = folder, doesn't modify the folder name
const convert = (name, allowedChars, type) => {

    if(type == 'f') {
        var nameReplace = '$&';
    } else {
        var nameReplace = type+'$&';
    }

    console.log('nameReplace = '+nameReplace);

    allowedChars = allowedChars || '-a-z0-9_';

    let iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE');
    return iconv.convert(''+name).toString()
                .toLowerCase()
                .replace(new RegExp('[^' + allowedChars + ']', 'g'), '')
                .replace(/^[0-9]+/g, nameReplace )
                .substr(0, 32);
};

export default convert;
