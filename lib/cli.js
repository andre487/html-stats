/**
 * @file
 * Command line interface
 */
var actions = require('./actions');

var actionName = process.argv[2];
if (!actionName) {
    throw new Error('No action passed');
}

var action = actions.ACTIONS_MAP[actionName];
if (!action) {
    throw new Error('Unknown action: ' + actionName);
}

var fileNames = process.argv.slice(3);
if (!fileNames.length) {
    throw new Error('No files passed');
}

action(fileNames).done();
