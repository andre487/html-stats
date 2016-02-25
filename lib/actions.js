/**
 * @file
 * Program actions
 */
var _ = require('lodash');
var htmlStats = require('./index');

var actions = exports;

/* eslint-disable no-console */

/**
 * Analyze document's structure
 *
 * @param {String[]} fileNames
 *
 * @returns {Promise}
 */
actions.analyzeStruct = function (fileNames) {
    return htmlStats.calcFilesStats(fileNames)
        .then(_.partial(JSON.stringify, _, null, 2))
        .then(console.log);
};

actions.ACTIONS_MAP = {
    struct: actions.analyzeStruct
};
