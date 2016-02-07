var path = require('path');

var Assert = require('chai').assert;
var _ = require('lodash');

var Files = require('../lib/files');

describe('files', function () {
    describe('#read()', function () {
        it('should read files', function () {
            var filesList = _.map(['test1.in.html', 'test1.out.js'], function (name) {
                return path.join(__dirname, 'index.data', name);
            });

            function check(contents) {
                Assert.isArray(contents);
                Assert.lengthOf(contents, 2);

                _.each(contents, function (fileContent) {
                    Assert.ok(fileContent);
                });
            }

            return Files.read(filesList)
                .then(check);
        });
    });
});
