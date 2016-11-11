[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.svg)](http://travis-ci.org/michaelnisi/pickup)
[![Coverage Status](https://coveralls.io/repos/github/michaelnisi/pickup/badge.svg?branch=master)](https://coveralls.io/github/michaelnisi/pickup?branch=master)

# pickup - transform feeds

The **pickup** [Node](http://nodejs.org/) package provides a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream from [RSS 2.0](http://cyber.law.harvard.edu/rss/rss.html), including [iTunes](https://www.apple.com/itunes/podcasts/specs.html) namespace extensions, and [Atom 1.0](http://atomenabled.org/developers/syndication/) formatted XML to newline separated JSON strings or objects.

## Usage

### Command-line

If you haven't yet, first install **[json](https://github.com/trentm/json)**—a command for working with JSON on the command-line:

```
$ npm install -g json
```

Now you can pipe **pickup** to **json**:

```
$ export URL=www.newyorker.com/feed/posts
$ curl -sS $URL | pickup | json -g
```

Or, for example, to filter the titles:

```
$ curl -sS $URL | pickup | json -ga title
```

### Library

#### Transforming from stdin to stdout

```js
const pickup = require('pickup')

process.stdin
  .pipe(pickup())
  .pipe(process.stdout)
```

You can run this example from the command-line:

```
$ curl -sS $URL | node example/stdin.js | json -g
```

#### Proxy server

```js
const http = require('http')
const pickup = require('pickup')

http.createServer((req, res) => {
  http.get('http:/'.concat(req.url), (feed) => {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
```

To try the proxy server:

```
$ node example/proxy.js &
$ curl -sS http://localhost:8080/$URL | json -ga title
```

## Types

### str()

This can either be a `String()`, `null`, or `undefined`.

### opts()

The options [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) is passed to the `Transform` stream constructor.

**pickup** uses following additional options:

- `eventMode` [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) defaults to `false`, if `true` readable state buffers are not filled and no `'data'`, but `'feed'` and `'entry'` events are emitted.

- `charset` `str()` | `'UTF-8'` | `'ISO-8859-1'` An optional string to specify the encoding of input data. In the common use case you received this string in the headers of your HTTP response before you began parsing. If you, not so commonly, cannot provide the encoding upfront, **pickup** tries to detect the encoding, and eventually defaults to `'UTF-8'`. The `charset` option is corresponding to the optional `charset` MIME type parameter found in  `Content-Type` HTTP headers. It's OK to pass any string, **pickup** will fall back on `'UTF-8'` when confused.

### feed()

- `author` `str()`
- `copyright` `str()`
- `id` `str()`
- `image` `str()`
- `language` `str()`
- `link` `str()`
- `payment` `str()`
- `subtitle` `str()`
- `summary` `str()`
- `title` `str()`
- `ttl` `str()`
- `updated` `str()`

### enclosure()

- `href` `str()`
- `length` `str()`
- `type` `str()`

### entry()

- `author` `str()`
- `enclosure` `enclosure()` or `undefined`
- `duration` `str()`
- `id` `str()`
- `image` `str()`
- `link` `str()`
- `subtitle` `str()`
- `summary` `str()`
- `title` `str()`
- `updated` `str()`

### Event:'feed'

```js
feed()
```
Emitted when the meta information of the feed gets available.

### Event:'entry'

```js
entry()
```
Emitted for each entry.

## Exports

```js
pickup(opts())
```

**pickup** exports a function that returns a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream which emits newline separated JSON strings, in `objectMode` the `'data'` event contains `entry()` or `feed()` objects. As per XML's structure the last `'data'` event usually contains the `feed()` object. In `eventMode` neither `'readable'` nor `'data'` events are emitted, instead `'feed'` and `'entry'` events are fired.

## Installation

With [npm](https://npmjs.org/package/pickup), do:

```
$ npm install pickup
```

To use the CLI (as above):

```
$ npm install -g pickup
```

## Contribute

Please create an issue if you encounter a feed that **pickup** fails to parse.

## License

[MIT license](https://raw.github.com/michaelnisi/pickup/master/LICENSE)
