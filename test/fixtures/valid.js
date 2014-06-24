var url = require('url');
var qs = require('querystring');
var util = require('util');

module.exports = function(href, query) {
	var path = url.parse(href).pathname;
	return util.format('%s/%s', path, qs.stringify(query));
};
