/**
 * @file
 * Functions for selectors stats calculating
 */
var Q = require('q');
var _ = require('lodash');

var Files = require('./files');
var Parser = require('./parser');

var selectorsStats = exports;

/**
 * Calculate stats for files list
 *
 * @param {String[]} fileNames
 *
 * @returns {Promise<Object>}
 */
selectorsStats.calcFilesStats = function (fileNames) {
    return Files.read(fileNames)
        .then(selectorsStats.calcSelectors)
        .then(selectorsStats.mergeSelectorsStat);
};

/**
 * Calculate selectors for all HTML files
 *
 * @param {String[]} htmlList
 *
 * @returns {Promise<Object>}
 */
selectorsStats.calcSelectors = function (htmlList) {
    if (!_.isArray(htmlList)) {
        throw new Error('htmlList is not an array');
    }

    var promises = _.map(htmlList, selectorsStats.calcDocumentStats);

    return Q.all(promises);
};

/**
 * Calculate one document stats
 *
 * @param {String} html
 *
 * @returns {Promise<Object>}
 */
selectorsStats.calcDocumentStats = function (html) {
    var calcStats = _.flow(Parser.flatten, selectorsStats.countDomStats);

    return Parser.parse(html).then(calcStats);
};

/**
 * Calculate document's selectors table
 *
 * @param {Object} nodesList
 *
 * @returns {Object}
 */
selectorsStats.countDomStats = function (nodesList) {
    var selectorCounts = {};

    function incAttrib(content) {
        if (!(content in selectorCounts)) {
            selectorCounts[content] = 0;
        }

        selectorCounts[content]++;
    }

    _.each(nodesList, function (node) {
        var id = _.get(node, 'attribs.id');
        var classes = _.get(node, 'attribs.class', '').split(/\s+/);

        id && incAttrib('#' + id);

        _.each(classes, function (className) {
            className && incAttrib('.' + className);
        });
    });

    return selectorCounts;
};

/**
 * Merge all documents stats to one table
 *
 * @param {Object} documentsStats
 *
 * @returns {Object}
 */
selectorsStats.mergeSelectorsStat = function (documentsStats) {
    var dirtyStats = {};

    _.each(documentsStats, function (docStats) {
        _.each(docStats, function (count, selector) {
            selector in dirtyStats ?
                dirtyStats[selector] += count :
                dirtyStats[selector] = count;
        });
    });

    return _(dirtyStats).toPairs()
        .sort(function (a, b) {
            return b[1] - a[1]; // Reverted order
        })
        .fromPairs()
        .value();
};
