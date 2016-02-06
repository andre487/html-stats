/**
 * @file
 * HTML parser lib
 */
var HtmlParser = require('htmlparser');
var Q = require('q');
var _ = require('lodash');

var Parser = exports;

/**
 * Parse HTML to AST
 *
 * @param {String} html
 *
 * @returns {Promise<Object[]>}
 */
Parser.parse = function parse(html) {
    var deferred = Q.defer();

    function onHtmlParsed(error, dom) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(dom);
        }
    }

    var handler = new HtmlParser.DefaultHandler(onHtmlParsed);
    var parser = new HtmlParser.Parser(handler);

    parser.parseComplete(html);

    return deferred.promise;
};

/**
 * Transform DOM AST to flat array
 *
 * @param {Object[]} dom
 *
 * @returns {Object[]}
 */
Parser.flatten = function flatten(dom) {
    return _.transform(dom, function iterate(res, node) {
        res.push(node);

        res.push.apply(res, flatten(node.children));
        delete node.children;

        return res;
    });
};
