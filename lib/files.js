/**
 * @file
 * Module for working with files
 */
var Fs = require('fs');

var Q = require('q');
var _ = require('lodash');

var Files = exports;

/**
 * Read files
 *
 * @param {String[]} namesList
 *
 * @returns {String}
 */
Files.read = function read(namesList) {
    var promises = _.map(namesList, _.partial(Q.ninvoke, Fs, 'readFile', _, 'utf-8'));
    return Q.all(promises);
};
