/**
 * @file
 * Package main file with main functions
 */
var Q = require('q');
var _ = require('lodash');

var Files = require('./files');
var StatCounter = require('./stat-counter');
var Parser = require('./parser');

var percentile = require('stats-percentile');
var countBytes = require('./count-utf8-bytes');

var htmlStats = exports;

/**
 * Percentiles to calculate in summary stats
 * @type {Number[]}
 */
htmlStats.PERCENTILES = [25, 50, 75, 95, 98, 100];

/**
 * Calculate stats for files list
 *
 * @param {String[]} fileNames
 *
 * @returns {Promise<Object>}
 */
htmlStats.calcFilesStats = function (fileNames) {
    return Files.read(fileNames)
        .then(htmlStats.calcDocumentListStats)
        .then(htmlStats.calcSummaryStats);
};

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

/**
 * Calculate documents list stats
 *
 * @param {String[]} htmlList
 *
 * @returns {Promise<Object[]>}
 */
htmlStats.calcDocumentListStats = function calcDocumentListStats(htmlList) {
    if (!_.isArray(htmlList)) {
        throw new Error('htmlList is not an array');
    }

    var promises = _.map(htmlList, htmlStats.calcDocumentStats);

    return Q.all(promises);
};

/**
 * Calculate summary stats
 *
 * @param {Object[]} documentsStats
 *
 * @returns {Object}
 */
htmlStats.calcSummaryStats = function calcSummaryStats(documentsStats) {
    if (!documentsStats.length) {
        return {};
    }

    function calcStat(res, key) {
        var values = _.map(documentsStats, key);

        res[key] = _.transform(htmlStats.PERCENTILES, function calcPercentile(res, p) {
            res[p] = percentile.calc(values, p);
            return res;
        }, {});

        return res;
    }

    var keys = _.keys(documentsStats[0]);
    return _.reduce(keys, calcStat, {});
};
