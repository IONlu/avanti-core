var User = require('user.js'),
    args = process.argv.slice(2);

if (args.length < 2) {
    console.log('invalid arg count');
    return;
}

switch (args[0]) {
    case 'user':
        if (args[1] == 'create') {
            if (args.length < 4) {
                console.log('invalid arg count');
                return;
            }
            return User.create(args[2], args[3]);
        }
        if (args[1] == 'remove') {
            if (args.length < 3) {
                console.log('invalid arg count');
                return;
            }
            return User.remove(args[2]);
        }
        break;
}
