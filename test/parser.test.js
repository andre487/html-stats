var Assert = require('chai').assert;
var Parser = require('../lib/parser');

describe('parser', function () {
    describe('#parse()', function () {
        it('should parse correct raw HTML', function () {
            var rawHtml = '<!DOCTYPE tags><tags><body><p>Some text';

            function check(dom) {
                Assert.isArray(dom);
                Assert.lengthOf(dom, 2);

                Assert.deepPropertyVal(dom, '0.name', '!DOCTYPE');
                Assert.deepPropertyVal(dom, '1.name', 'tags');

                Assert.deepPropertyVal(dom, '1.children.0.children.0.children.0.data', 'Some text');
            }

            return Parser.parse(rawHtml).then(check);
        });

        it('should parse attributes', function () {
            var rawHtml = '<div data-foo="bar">Some text</div>';

            function check(dom) {
                Assert.isArray(dom);
                Assert.lengthOf(dom, 1);

                Assert.deepPropertyVal(dom, '0.data', 'div data-foo="bar"');
                Assert.deepPropertyVal(dom, '0.attribs.data-foo', 'bar');
            }

            return Parser.parse(rawHtml).then(check);
        });
    });

    describe('#flatten()', function () {
        it('should flatten DOM', function () {
            var rawHtml = '<!DOCTYPE tags><tags><body><p data-foo="bar">Some text';

            function check(nodesList) {
                Assert.deepPropertyVal(nodesList, '0.data', '!DOCTYPE tags');
                Assert.deepPropertyVal(nodesList, '1.data', 'tags');
                Assert.deepPropertyVal(nodesList, '2.data', 'body');
                Assert.deepPropertyVal(nodesList, '3.data', 'p data-foo="bar"');
                Assert.deepPropertyVal(nodesList, '4.data', 'Some text');
            }

            return Parser.parse(rawHtml)
                .then(Parser.flatten)
                .then(check);
        });
    });
});
