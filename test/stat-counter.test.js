var Assert = require('chai').assert;

var Parser = require('../lib/parser');
var StatCounter = require('../lib/stat-counter');

var countBytes = require('../lib/count-utf8-bytes');

describe('stat-counter', function () {
    describe('#createDomStatsObject()', function () {
        it('should provide object with correct structure', function () {
            var stats = StatCounter.createDomStatsObject();

            Assert.property(stats, 'total');
            Assert.property(stats, 'tags');
            Assert.property(stats, 'attributes');
            Assert.property(stats, 'css');
            Assert.property(stats, 'scripts');
            Assert.property(stats, 'comments');
            Assert.property(stats, 'text');
        });
    });

    describe('#countDomStats()', function () {
        describe('tags and attributes', function () {
            it('should count directives sizes', function () {
                var html = '<!DOCTYPE html>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'directives', 15);

                    Assert.equal(stats.directives, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count tag sizes', function () {
                var html = '<p data-foo="bar">Some text</p>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 14);
                    Assert.propertyVal(stats, 'tags', 8);
                    Assert.propertyVal(stats, 'text', 9);

                    Assert.equal(stats.attributes + stats.tags + stats.text, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count multiple tags sizes', function () {
                var html = '<p data-foo="bar">Some text 1</p><p data-foo="bar">Some text 2</p>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 28);
                    Assert.propertyVal(stats, 'tags', 16);
                    Assert.propertyVal(stats, 'text', 22);

                    Assert.equal(stats.attributes + stats.tags + stats.text, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count unicode sizes', function () {
                var html = '<p>Текст в юникоде</p>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 0);
                    Assert.propertyVal(stats, 'tags', 7);
                    Assert.propertyVal(stats, 'text', 28);

                    Assert.equal(stats.attributes + stats.tags + stats.text, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count comments sizes', function () {
                var html = '<!-- Comment 1 --><p>Some text</p>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'comments', 18);
                    Assert.propertyVal(stats, 'tags', 7);
                    Assert.propertyVal(stats, 'text', 9);

                    Assert.equal(stats.comments + stats.tags + stats.text, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count script sizes', function () {
                var html = '<script type="text/javascript">alert(1);</script>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 22);
                    Assert.propertyVal(stats, 'tags', 18);
                    Assert.propertyVal(stats, 'scripts', 9);

                    Assert.equal(stats.attributes + stats.tags + stats.scripts, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count script[src] sizes', function () {
                var html = '<script type="text/javascript" src="foo.js"></script>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 34);
                    Assert.propertyVal(stats, 'tags', 19);

                    Assert.equal(stats.attributes + stats.tags, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count styles sizes', function () {
                var html = '<style type="text/css">body {font-size: 10px;}</style>';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 15);
                    Assert.propertyVal(stats, 'tags', 16);
                    Assert.propertyVal(stats, 'css', 23);

                    Assert.equal(stats.attributes + stats.tags + stats.css, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });

            it('should count void elements', function () {
                var html = '<img src="foo.jpg" />';

                function check(stats) {
                    Assert.propertyVal(stats, 'total', countBytes(html));
                    Assert.propertyVal(stats, 'attributes', 13);
                    Assert.propertyVal(stats, 'tags', 8);

                    Assert.equal(stats.attributes + stats.tags, stats.total);
                }

                return Parser.parse(html)
                    .then(Parser.flatten)
                    .then(StatCounter.countDomStats)
                    .then(check);
            });
        });
    });
});
