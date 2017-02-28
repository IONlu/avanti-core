export const command = 'host';

export const description = 'host manager';

export const options = {
    list: {
        alias: 'l',
        describe: 'list hosts',
        type: 'boolean'
    },
    client: {
        describe: 'client to use',
        type: 'string'
    },
    create: {
        alias: 'c',
        describe: 'host to create',
        type: 'string'
    },
    remove: {
        alias: 'r',
        describe: 'host to remove',
        type: 'string'
    }
};

export const handle = (argv, yargs) => {
    var actions = ['list', 'create', 'remove'];
    for (let i = 0; i < actions.length; i++) {
        if (argv[actions[i]]) {
            return require('./' + actions[i]).execute(argv);
        }
    }

    yargs.showHelp();
};
