var stream = require('stream');
var util = require('util');

var syntax = require('syntax-error');

var Syntactical = function(file, options) {
	stream.Transform.call(this);

	options = options || {};

	this._file = file;
	this._options = options;
	this._buffer = [];
};

util.inherits(Syntactical, stream.Transform);

Syntactical.prototype._transform = function(data, encoding, callback) {
	this._buffer.push(data);

	if(!this._options.buffer) callback(null, data);
	else callback();
};

Syntactical.prototype._flush = function(callback) {
	var buffer = Buffer.concat(this._buffer);
	var err = syntax(buffer.toString('utf-8'), this._file);

	if(err) return callback(err);

	if(this._options.buffer) this.push(buffer);
	callback();
};

module.exports = function(file, options) {
	if(/\.json$/.test(file)) return new stream.PassThrough();
	return new Syntactical(file, options);
};
