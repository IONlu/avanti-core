var registry = {};

export default {

    set: (key, value) => {
        if (registry[key]) {
            throw '"' + key + '" already set';
        }
        registry[key] = value;
    },

    get: (key) => {
        if (!registry[key]) {
            throw '"' + key + '" not set';
        }
        return registry[key];
    }

};
