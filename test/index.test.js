var fs = require('fs');
var path = require('path');

var Assert = require('chai').assert;
var _ = require('lodash');

var HtmlStats = require('../lib');

describe('html-stats', function () {
    describe('#calcDocumentStats()', function () {
        it('should calculate stats correctly', function () {
            var inHtml = read('test1.in.html');
            var expected = require('./index.data/test1.out');

            var isPartialStat = _.negate(_.partial(_.includes, ['total', 'rawTotal']));
            var calculatedSizes = _.keys(expected)
                .filter(isPartialStat)
                .reduce(function (size, name) {
                    return size + expected[name];
                }, 0);

            Assert.propertyVal(expected, 'total', expected.rawTotal);
            Assert.equal(expected.total, calculatedSizes);

            function check(stats) {
                _.keys(expected).forEach(function (name) {
                    Assert.propertyVal(stats, name, expected[name]);
                });
            }

            return HtmlStats.calcDocumentStats(inHtml).then(check);
        });
    });

    describe('#calcDocumentListStats()', function () {
        it('should calculate stats by docs array', function () {
            var inHtml = read('test1.in.html');
            var expected = require('./index.data/test1.out');

            function check(statsList) {
                Assert.isArray(statsList);
                Assert.lengthOf(statsList, 1);

                _.keys(expected).forEach(function (name) {
                    Assert.propertyVal(statsList[0], name, expected[name]);
                });
            }

            return HtmlStats.calcDocumentListStats([inHtml]).then(check);
        });
    });

    describe('#calcSummaryStats()', function () {
        it('should calculate summary stats', function () {
            var stats = [];
            for (var i = 1; i <= 100; i++) {
                stats.push({foo: i});
            }

            var res = HtmlStats.calcSummaryStats(stats);

            Assert.property(res, 'foo');

            Assert.deepPropertyVal(res, 'foo.25', 25);

            Assert.deepPropertyVal(res, 'foo.50', 50);

            Assert.deepPropertyVal(res, 'foo.75', 75);

            Assert.deepPropertyVal(res, 'foo.95', 95);
            Assert.deepPropertyVal(res, 'foo.98', 98);
            Assert.deepPropertyVal(res, 'foo.100', 100);
        });
    });

    function read(fileName) {
        var filePath = path.join(__dirname, 'index.data', fileName);
        return fs.readFileSync(filePath, 'utf-8');
    }
});
