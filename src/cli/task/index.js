import * as Task from '../../task';

export const command = 'task <task>';

export const description = 'execute task';

export const options = {};

export const handle = argv => {
    Task.run(argv.task, argv);
};
