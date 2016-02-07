/**
 * @file
 * Functions for nodes stats counting
 */
var countBytes = require('./count-utf8-bytes');
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
        spaces: 0,

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
    var stats = _.reduce(nodesList, statCounter.countNodeStats, statCounter.createDomStatsObject());

    delete stats.__textFlags;

    return stats;
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
    var size = countBytes(node.data) + 2;

    stats.total += size;
    stats.directives += size;
}

function calcTagStats(stats, node) {
    var tagSize = countBytes(node.name);

    var additionalSize = _.includes(statCounter.VOID_ELEMENTS, node.name) ? 2 : tagSize + 5;
    var totalSize = countBytes(node.data) + additionalSize;

    var attrsSize = _.reduce(node.attribs, function countAttrStats(size, val, key) {
        return size + countBytes(val) + countBytes(key) + 3;
    }, 0);

    stats.total += totalSize;
    stats.tags += totalSize - attrsSize;
    stats.attributes += attrsSize;
}

function calcTextStats(stats, node) {
    var textSize = countBytes(node.data);

    stats.total += textSize;

    switch (true) {
        case stats.__textFlags.calcTextAsScript:
            stats.scripts += textSize;
            break;
        case stats.__textFlags.calcTextAsStyle:
            stats.css += textSize;
            break;
        default:
            calcPlainTextStats(stats, node.data, textSize);
    }

    stats.__textFlags = {};
}

function calcPlainTextStats(stats, text, textSize) {
    if (/^\s+$/.test(text)) {
        stats.spaces += textSize;
    } else {
        stats.text += textSize;
    }
}

function calcCommentStats(stats, node) {
    var size = countBytes(node.data) + 7;

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
