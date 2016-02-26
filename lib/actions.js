/**
 * @file
 * Program actions
 */
var _ = require('lodash');
var selectorsStats = require('./selectors-stats');
var structStats = require('./struct-stats');

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
    return structStats.calcFilesStats(fileNames)
        .then(_.partial(JSON.stringify, _, null, 2))
        .then(console.log);
};

/**
 * Analyze elements selectors (ids, classes)
 *
 * @param {String[]} fileNames
 */
actions.analyzeSelectors = function (fileNames) {
    return selectorsStats.calcFilesStats(fileNames)
        .then(_.partial(JSON.stringify, _, null, 2))
        .then(console.log);
};

actions.ACTIONS_MAP = {
    struct: actions.analyzeStruct,
    selectors: actions.analyzeSelectors
};
