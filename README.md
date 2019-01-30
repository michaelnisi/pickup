[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.svg)](http://travis-ci.org/michaelnisi/pickup)
[![Coverage Status](https://coveralls.io/repos/github/michaelnisi/pickup/badge.svg?branch=master)](https://coveralls.io/github/michaelnisi/pickup?branch=master)

# pickup - transform feeds

The **pickup** [Node](http://nodejs.org/) package transforms XML feeds to JSON or objects. Exporting a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream, it parses [RSS 2.0](http://cyber.law.harvard.edu/rss/rss.html), including [iTunes](https://www.apple.com/itunes/podcasts/specs.html) namespace extensions, and [Atom 1.0](http://atomenabled.org/developers/syndication/) formatted XML, producing newline separated JSON strings or objects.

## Usage

### Command-line

```
$ export URL=https://www.newyorker.com/feed/posts
$ curl -sS $URL | node example/stdin.js
```

The Standard Input example is more or less the CLI binary of **pickup**, `./bin/cli.js`, which you can install globally if you want to.

```
npm i -g pickup
```

Piping data to **pickup**, you can now, for example, parse feeds from the network using [curl](https://curl.haxx.se) on the command-line.

```
$ curl -sS $URL | pickup
```

For convenient JSON massaging, I use [json](https://github.com/trentm/json), available on [npm](https://www.npmjs.com).

```
$ npm install -g json
```

Now you can extend your pipe for correct formatting…

```
$ curl -sS $URL | pickup | json -g
```

…and handy filtering.

```
$ curl -sS $URL | node pickup | json -ga title
```

### REPL

Another way of playing with **pickup** is its simple REPL.

```
% ./repl.js
pickup> let x = get('https://www.newyorker.com/feed/posts')
pickup> read(x, Entry, 'title')
pickup> 'An Asylum Seeker’s Quest to Get Her Toddler Back'
'At N.H.L.’s All-Star Weekend, Female Players Prove Their Excellence, but NBC Can’t Keep Up'
'Cliff Sims Is Proud to Have Served Trump'
'The Slimmed-Down and Soothing New “Conan”'
'Donald Trump’s Chance to Bring Peace to Afghanistan and End America’s Longest War'
'The First Days of Disco'
'How Various Government Agencies Celebrated the End of the Shutdown'
'Why We Care (and Don’t Care) About the New Rules of Golf'
'Howard Schultz Against the Hecklers'
'Daily Cartoon: Tuesday, January 29th'
ok
pickup>
```

Look at `./repl.js` to see what it can do. Not much, but enough for exploring exotic feeds.

### Library

#### Transforming from stdin to stdout

Here’s the Standard Input example from before again.

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
const https = require('https')
const pickup = require('../')

http.createServer((req, res) => {
  https.get('https:/'.concat(req.url), (feed) => {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
```

To try the proxy server:

```
$ node example/proxy.js &
$ curl -sS http://localhost:8080/www.newyorker.com/feed/posts | json -ga title
```

## Types

### str()

This can either be a `String()`, `null`, or `undefined`.

### opts()

The options [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) is passed to the `Transform` stream constructor.

**pickup** uses following additional options:

- `eventMode` [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) defaults to `false`, if `true` readable state buffers are not filled and no `'data'`, but `'feed'` and `'entry'` events are emitted.

- `charset` `str()` | `'UTF-8'` | `'ISO-8859-1'` An optional string to specify the encoding of input data. In the common use case you received this string in the headers of your HTTP response before you began parsing. If you, not so commonly, cannot provide the encoding upfront, **pickup** tries to detect the encoding, and eventually defaults to `'UTF-8'`. The `charset` option is corresponding to the optional `charset` MIME type parameter found in  `Content-Type` HTTP headers. It's OK to pass any string, **pickup** will fall back on `'UTF-8'` when confused.

### url()

An `undefined` property, not populated by the parser, to identify feeds and entries in upstream systems, without prompting V8 to create new [hidden classes](https://github.com/v8/v8/wiki/Design%20Elements#fast-property-access).

### feed()

- `author` `str()`
- `copyright` `str()`
- `id` `str()`
- `image` `str()`
- `language` `str()`
- `link` `str()`
- `originalURL` `url()`
- `payment` `str()`
- `subtitle` `str()`
- `summary` `str()`
- `title` `str()`
- `ttl` `str()`
- `updated` `str()`
- `url` `url()`

### enclosure()

- `length` `str()`
- `type` `str()`
- `url` `str()`

### entry()

- `author` `str()`
- `duration` `str()`
- `enclosure` `enclosure()` or `undefined`
- `id` `str()`
- `image` `str()`
- `link` `str()`
- `originalURL` `url()`
- `subtitle` `str()`
- `summary` `str()`
- `title` `str()`
- `updated` `str()`
- `url` `url()`

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
