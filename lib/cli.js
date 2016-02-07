/**
 * @file
 * Command line interface
 */
var _ = require('lodash');

var htmlStats = require('./index');

/* eslint-disable no-console */

var fileNames = process.argv.slice(2);
if (!fileNames.length) {
    throw new Error('No files passed');
}

htmlStats.calcFilesStats(fileNames)
    .then(_.partial(JSON.stringify, _, null, 2))
    .then(console.log);
