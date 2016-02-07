var bytes = require('utf8-bytes');

module.exports = function countUtf8Length(str) {
    return bytes(str).length;
};
