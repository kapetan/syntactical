var fs = require('fs');
var path = require('path');
var stream = require('stream');

var test = require('tape');
var concat = require('concat-stream');
var browserify = require('browserify');

var syntactical = require('../index');

var fixtures = function(name) {
	return path.join(__dirname, 'fixtures', name);
};

var dummy = function() {
	var pass = new stream.PassThrough();
	pass.on('data', function() {
		pass.emit('error', new Error('dummy_error'));
	});

	return pass;
};

test('valid js file', function(t) {
	t.plan(1);

	var valid = fixtures('valid.js');
	var b = browserify()
		.add(valid)
		.transform(syntactical);

	b.bundle()
		.pipe(concat(function(data) {
			t.ok(data.length, 'should return compiled script');
		}));
});

test('invalid js file', function(t) {
	t.plan(1);

	var invalid = fixtures('invalid.js');
	var b = browserify()
		.add(invalid)
		.transform(syntactical);

	b.bundle()
		.on('error', function(err) {
			t.ok(err instanceof SyntaxError, 'should return syntax error');
		})
		.pipe(concat());
});

// Sanity check. Transforming invalid javascript without
// syntactical transform generates common errors.
test('dummy transform invalid js file', function(t) {
	t.plan(1);

	var invalid = fixtures('invalid.js');
	var b = browserify()
		.add(invalid)
		.transform(dummy);

	b.bundle()
		.on('error', function(err) {
			t.equal(err.message, 'dummy_error');
		})
		.pipe(concat());
});

test('dummy transform invalid js file after syntactical with buffer option enabled', function(t) {
	t.plan(1);

	var invalid = fixtures('invalid.js');
	var b = browserify()
		.add(invalid)
		.transform(syntactical, { buffer: true })
		.transform(dummy);

	b.bundle()
		.on('error', function(err) {
			t.ok(err instanceof SyntaxError, 'should return syntax error');
		})
		.pipe(concat());
});
