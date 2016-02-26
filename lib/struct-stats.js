/**
 * @file
 * Package main file with main functions
 */
var Q = require('q');
var _ = require('lodash');

var Files = require('./files');
var StatCounter = require('./struct-stat-counter');
var Parser = require('./parser');

var percentile = require('stats-percentile');
var countBytes = require('./count-utf8-bytes');

var structStats = exports;

/**
 * Percentiles to calculate in summary stats
 * @type {Number[]}
 */
structStats.PERCENTILES = [25, 50, 75, 95, 98, 100];

/**
 * Calculate stats for files list
 *
 * @param {String[]} fileNames
 *
 * @returns {Promise<Object>}
 */
structStats.calcFilesStats = function (fileNames) {
    return Files.read(fileNames)
        .then(structStats.calcDocumentListStats)
        .then(structStats.calcSummaryStats);
};

/**
 * Calculate one document stats
 *
 * @param {String} html
 *
 * @returns {Promise<Object>}
 */
structStats.calcDocumentStats = function calcDocumentStats(html) {
    function addRawSize(stats) {
        stats.rawTotal = countBytes(html);
        return stats;
    }

    var calcStats = _.flow(Parser.flatten, StatCounter.countDomStats, addRawSize);

    return Parser.parse(html).then(calcStats);
};

/**
 * Calculate documents list stats
 *
 * @param {String[]} htmlList
 *
 * @returns {Promise<Object[]>}
 */
structStats.calcDocumentListStats = function calcDocumentListStats(htmlList) {
    if (!_.isArray(htmlList)) {
        throw new Error('htmlList is not an array');
    }

    var promises = _.map(htmlList, structStats.calcDocumentStats);

    return Q.all(promises);
};

/**
 * Calculate summary stats
 *
 * @param {Object[]} documentsStats
 *
 * @returns {Object}
 */
structStats.calcSummaryStats = function calcSummaryStats(documentsStats) {
    if (!documentsStats.length) {
        return {};
    }

    function calcStat(res, key) {
        var values = _.map(documentsStats, key);

        res[key] = _.transform(structStats.PERCENTILES, function calcPercentile(res, p) {
            res[p] = percentile.calc(values, p);
            return res;
        }, {});

        return res;
    }

    var keys = _.keys(documentsStats[0]);
    return _.reduce(keys, calcStat, {});
};
