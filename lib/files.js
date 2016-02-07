/**
 * @file
 * Module for working with files
 */
var Fs = require('fs');

var Q = require('q');
var _ = require('lodash');

var glob = require('glob');

var Files = exports;

/**
 * Read files
 *
 * @param {String[]} namesList
 *
 * @returns {String}
 */
Files.read = function read(namesList) {
    return extractNames(namesList).then(readFiles);
};

function extractNames(namesList) {
    var filesPromises = _.map(namesList, function (name) {
        return Q.nfcall(glob, name);
    });
    return Q.all(filesPromises).then(_.flattenDeep);
}

function readFiles(namesList) {
    var promises = _.map(namesList, _.partial(Q.ninvoke, Fs, 'readFile', _, 'utf-8'));
    return Q.all(promises);
}
