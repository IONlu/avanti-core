const get = function get(object, property) {
    if (typeof object !== 'object') {
        throw 'Invalid config object';
    }

    const [ key, propertyPart ] = property.split('.', 2);

    if (!object.hasOwnProperty(key)) {
        throw `Config key "${key}" missing`;
    }

    if (!propertyPart) {
        return object[key];
    }

    return get(object[key], propertyPart);
};

class Config {

    constructor(file) {
        this.data = require(file);
    }

    get(key) {
        return get(this.data, key);
    }

}

export default Config;
