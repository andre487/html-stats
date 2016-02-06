var Parser = require('../lib/parser');

var assert = require('chai').assert;

describe('parser', function () {
    describe('#parse()', function () {
        it('should parse correct raw HTML', function () {
            var rawHtml = '<!DOCTYPE html><html><body><p>Some text';

            function check(dom) {
                assert.isArray(dom);
                assert.lengthOf(dom, 2);

                assert.deepPropertyVal(dom, '0.name', '!DOCTYPE');
                assert.deepPropertyVal(dom, '1.name', 'html');

                assert.deepPropertyVal(dom, '1.children.0.children.0.children.0.data', 'Some text');
            }

            return Parser.parse(rawHtml).then(check);
        });

        it('should parse attributes', function () {
            var rawHtml = '<div data-foo="bar">Some text</div>';

            function check(dom) {
                assert.isArray(dom);
                assert.lengthOf(dom, 1);

                assert.deepPropertyVal(dom, '0.data', 'div data-foo="bar"');
                assert.deepPropertyVal(dom, '0.attribs.data-foo', 'bar');
            }

            return Parser.parse(rawHtml).then(check);
        });
    });

    describe('#flatten()', function () {
        it('should flatten DOM', function () {
            var rawHtml = '<!DOCTYPE html><html><body><p data-foo="bar">Some text';

            function check(nodesList) {
                assert.deepPropertyVal(nodesList, '0.data', '!DOCTYPE html');
                assert.deepPropertyVal(nodesList, '1.data', 'html');
                assert.deepPropertyVal(nodesList, '2.data', 'body');
                assert.deepPropertyVal(nodesList, '3.data', 'p data-foo="bar"');
                assert.deepPropertyVal(nodesList, '4.data', 'Some text');
            }

            return Parser.parse(rawHtml)
                .then(Parser.flatten)
                .then(check);
        });
    });
});
