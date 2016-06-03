const io = require('socket.io-client');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [{
    name: 'host',
    alias: 'h',
    type: String
}];
const options = commandLineArgs(optionDefinitions);

var socket = io.connect(options.host || 'http://localhost:3000');
socket.on('connect', () => console.log('connect'));

console.log('Connecting to: ' + options.host || 'http://localhost:3000');
