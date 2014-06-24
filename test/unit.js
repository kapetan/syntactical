var fs = require('fs');
var path = require('path');

var test = require('tape');
var concat = require('concat-stream');

var syntactical = require('../index');

var VALID_PARTS = [new Buffer('var a'), new Buffer('=1;')];
var VALID_BUFFER = Buffer.concat(VALID_PARTS);

var INVALID_PARTS = VALID_PARTS.concat([new Buffer(',')]);
var INVALID_BUFFER = Buffer.concat(INVALID_PARTS);

var fixtures = function(name) {
	return path.join(__dirname, 'fixtures', name);
};

test('json file', function(t) {
	t.plan(1);

	var json = fixtures('simple.json');

	fs.createReadStream(json)
		.pipe(syntactical(json))
		.pipe(concat(function(data) {
			t.deepEqual(data, fs.readFileSync(json));
		}));
});

test('valid js file', function(t) {
	t.plan(1);

	var valid = fixtures('valid.js');

	fs.createReadStream(valid)
		.pipe(syntactical(valid))
		.pipe(concat(function(data) {
			t.deepEqual(data, fs.readFileSync(valid));
		}));
});

test('invalid js file', function(t) {
	t.plan(1);

	var invalid = fixtures('invalid.js');
	var stream = syntactical(invalid);

	stream.on('error', function(err) {
		t.ok(err instanceof SyntaxError, 'should return syntax error');
	});

	fs.createReadStream(invalid)
		.pipe(stream)
		.pipe(concat());
});

test('valid input with buffer option disabled', function(t) {
	t.plan(3);

	var stream = syntactical('valid.js', { buffer: false });
	var i = 0;

	stream
		.on('data', function(data) {
			t.deepEqual(data, VALID_PARTS[i++]);
		})
		.pipe(concat(function(data) {
			t.deepEqual(data, VALID_BUFFER);
		}));

	VALID_PARTS.forEach(function(part) {
		stream.write(part);
	});

	stream.end();
});

test('valid input with buffer option enabled', function(t) {
	t.plan(2);

	var stream = syntactical('valid.js', { buffer: true });

	stream
		.on('data', function(data) {
			t.deepEqual(data, VALID_BUFFER);
		})
		.pipe(concat(function(data) {
			t.deepEqual(data, VALID_BUFFER);
		}));

	VALID_PARTS.forEach(function(part) {
		stream.write(part);
	});

	stream.end();
});
