/**
 * @file
 * Functions for nodes stats counting
 */
var countLength = require('./count-utf8-length');
var _ = require('lodash');

var statCounter = exports;

/**
 * DOM node handlers by types
 *
 * @type {Object}
 */
statCounter.COUNTERS = {
    directive: calcDirectiveStats,
    tag: calcTagStats,
    text: calcTextStats,
    comment: calcCommentStats,
    script: calcScriptStats,
    style: calcStyleStats
};

/**
 * Void HTML elements list
 *
 * @type {String[]}
 */
statCounter.VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link',
    'meta', 'param', 'source', 'track', 'wbr'];

/**
 * Create new stats object
 *
 * @returns {Object}
 */
statCounter.createDomStatsObject = function createDomStatsObject() {
    return {
        total: 0,
        directives: 0,
        tags: 0,
        attributes: 0,
        css: 0,
        scripts: 0,
        comments: 0,
        text: 0,

        __textFlags: {}
    };
};

/**
 * Count stats for all the document
 *
 * @param {Object[]} nodesList
 *
 * @returns {Object}
 */
statCounter.countDomStats = function countDomStats(nodesList) {
    return _.reduce(nodesList, statCounter.countNodeStats, statCounter.createDomStatsObject());
};

/**
 * Count stats for HTML node
 *
 * @param {Object} stats
 * @param {Object} node
 *
 * @returns {Object} The same stats
 */
statCounter.countNodeStats = function countNodeStats(stats, node) {
    var counter = statCounter.COUNTERS[node.type];
    if (!counter) {
        throw new Error('Invalid node type: ' + node.type);
    }
    counter(stats, node);

    return stats;
};

function calcDirectiveStats(stats, node) {
    var size = countLength(node.data) + 2;

    stats.total += size;
    stats.directives += size;
}

function calcTagStats(stats, node) {
    var tagSize = countLength(node.name);

    var additionalSize = _.includes(statCounter.VOID_ELEMENTS, node.name) ? 2 : tagSize + 5;
    var totalSize = countLength(node.data) + additionalSize;

    var attrsSize = _.reduce(node.attribs, function countAttrStats(size, val, key) {
        return size + countLength(val) + countLength(key) + 3;
    }, 0);

    stats.total += totalSize;
    stats.tags += totalSize - attrsSize;
    stats.attributes += attrsSize;
}

function calcTextStats(stats, node) {
    var textSize = countLength(node.data);

    stats.total += textSize;

    switch (true) {
        case stats.__textFlags.calcTextAsScript:
            stats.scripts += textSize;
            break;
        case stats.__textFlags.calcTextAsStyle:
            stats.css += textSize;
            break;
        default:
            stats.text += textSize;
    }

    stats.__textFlags = {};
}

function calcCommentStats(stats, node) {
    var size = countLength(node.data) + 7;

    stats.total += size;
    stats.comments += size;
}

function calcScriptStats(stats, node) {
    calcTagStats(stats, node);
    stats.__textFlags.calcTextAsScript = true;
}

function calcStyleStats(stats, node) {
    calcTagStats(stats, node);
    stats.__textFlags.calcTextAsStyle = true;
}
