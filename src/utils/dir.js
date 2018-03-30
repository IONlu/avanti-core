import mkdirp from 'mkdirp-promise';

const create = async path => {
    return mkdirp(path)
}

export {
    create
}
