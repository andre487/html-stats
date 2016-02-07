/**
 * @file
 * Package main file with main functions
 */
var _ = require('lodash');

var StatCounter = require('./stat-counter');
var Parser = require('./parser');

var countBytes = require('./count-utf8-bytes');

var htmlStats = exports;

/**
 * Calculate one document stats
 *
 * @param {String} html
 *
 * @returns {Promise<Object>}
 */
htmlStats.calcDocumentStats = function calcDocumentStats(html) {
    function addRawSize(stats) {
        stats.rawTotal = countBytes(html);
        return stats;
    }

    var calcStats = _.flow(Parser.flatten, StatCounter.countDomStats, addRawSize);

    return Parser.parse(html).then(calcStats);
};
