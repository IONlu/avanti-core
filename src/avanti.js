import io from 'socket.io-client';
import cliArgs from 'command-line-args';

const optionDefinitions = [{
    name: 'host',
    alias: 'h',
    type: String
}];
const options = cliArgs(optionDefinitions);

var socket = io.connect(options.host || 'http://localhost:3000');
socket.on('connect', () => console.log('connect'));

console.log('Connecting to: ' + options.host || 'http://localhost:3000');
