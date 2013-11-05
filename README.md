# pickup - transform RSS or Atom XML to JSON 

The pickup [Node.js](http://nodejs.org/) module is a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream to transform RSS 2.0 (including iTunes namespace extensions) and Atom 1.0 formatted XML to JSON.

[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.png)](http://travis-ci.org/michaelnisi/pickup) [![David DM](https://david-dm.org/michaelnisi/pickup.png)](http://david-dm.org/michaelnisi/pickup)

## Usage

### Command-line

Pipe [Gruber's](http://daringfireball.net/) podcast RSS feed to pickup:

    curl -sS http://feeds.feedburner.com/the_talk_show | pickup

If you haven't already, I suggest you install [jsontool](https://github.com/trentm/json), a `json` command for working with JSON on the command-line:

    npm install -g jsontool

So, now you may pipe `pickup` to `json` like so:

    curl -sS http://feeds.muleradio.net/thetalkshow | pickup | json

### Library

#### Transform from stdin to stdout

    var pickup = require('pickup')
      , transformer = pickup()
      , Readable = require('stream').Readable
      , reader = new Readable().wrap(process.openStdin())
      , writer = process.stdout

    reader.pipe(transformer).pipe(writer)

#### Proxy server

    var http = require('http')
      , url = require('url')
      , pickup = require('pickup')

    http.createServer(function (req, res) {
      http.get(url.parse('http:/' + req.url), function (feed) {
        feed.pipe(pickup()).pipe(res)
      })
    }).listen(8080)

To try the proxy server from the command-line:

    curl -sS http://localhost:8080/feeds.muleradio.net/thetalkshow | json

### pickup()

The `pickup` module exports a single function that returns a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream. Additionally to its [Stream](http://nodejs.org/api/stream.html) events (usually all you need) it emits `entry` events and one `feed` event which is emitted when information about the feed gets available. For each item in the input feed an `entry` event with the parsed data is emitted.

### Event:'feed'

The `feed` event emits a feed `Object` with following properties which can be `undefined`.

- `feed`
    - `author`
    - `copyright`
    - `id`
    - `image`
    - `language`
    - `link`
    - `payment`
    - `subtitle`
    - `summary` 
    - `title`
    - `ttl`
    - `updated`

### Event:'entry'

The `entry` event emits an `Entry` for each parsed item in the feed. Its properties can be `undefined`.

- `entry`
    - `author`
    - `enclosure`
        - `href`
        - `length`
        - `type`
    - `duration`
    - `id`
    - `link`
    - `subtitle`
    - `summary`
    - `title`
    - `updated`

## Installation

[![NPM](https://nodei.co/npm/pickup.png?stars&downloads)](https://npmjs.org/package/pickup) [![NPM](https://nodei.co/npm-dl/pickup.png)](https://nodei.co/npm/pickup/)

For CLI usage do:

    npm install -g pickup

## License

[MIT License](https://raw.github.com/michaelnisi/pickup/master/LICENSE)
