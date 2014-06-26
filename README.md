# syntactical

Browserify transform for validating the javascript source. Some browserify transformations emit syntax errors which are missing some basic information like filename and line number. Syntactical uses the [syntax-error][se] module to validate the source before passing it to the next transform.

# Usage

Add it at the beginning of the transform chain.

```javascript
var browserify = require('browserify');

browserify()
	.add('./path/to/entry.js')
	.transform('syntactical', { buffer: true })
	.transform('brfs')
	.bundle()
	.on('error', function(err) {
		console.log(err.toString());
	})
	.pipe(process.stdout);
```

The `buffer: true` option buffers the individual chunks and emits the whole input at once if there are no syntax errors. This prevents transforms down the chain to work on the source if it's invalid. The `buffer: false` option (default) keeps emitting the chunks as they are received, and emits a syntax error at the end on invalid source.

`err.toString()` will return something like the following.

```
/home/substack/projects/node-syntax-error/example/src.js:5
        if (Array.isArray(x) res.push.apply(res, x);
                             ^
ParseError: Unexpected identifier
```

[se]: https://github.com/substack/node-syntax-error
