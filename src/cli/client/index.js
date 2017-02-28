export const command = 'client';

export const description = 'client manager';

export const options = {
    list: {
        alias: 'l',
        describe: 'list clients',
        type: 'boolean'
    },
    create: {
        alias: 'c',
        describe: 'client to create',
        type: 'string'
    },
    remove: {
        alias: 'r',
        describe: 'client to remove',
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
