# pickup - transform RSS or Atom XML to JSON 

The pickup [Node.js](http://nodejs.org/) module is a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream to transform RSS 2.0 (including iTunes namespace extensions) and Atom 1.0 formatted XML to JSON.

[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.png)](http://travis-ci.org/michaelnisi/pickup)

## Usage

### Command-line

Pipe [Gruber's](http://daringfireball.net/) podcast RSS feed to pickup:

    curl -sS http://feeds.feedburner.com/the_talk_show | pickup

If you haven't already, I suggest you install [jsontool](https://github.com/trentm/json), a `json` command for working with JSON on the command-line:

    npm install -g jsontool

So, now you may pipe `pickup` to `json` like so:

    curl -sS http://feeds.feedburner.com/the_talk_show | pickup | json

### Library

To transform from stdin to stdout:

    var pickup = require('pickup')
      , transformer = pickup()
      , Readable = require('stream').Readable
      , reader = new Readable().wrap(process.openStdin())
      , writer = process.stdout

    reader.pipe(transformer).pipe(writer)

### pickup()

The `pickup` module exports one function that returns a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream which—additionally to [Stream](http://nodejs.org/api/stream.html) events—emits following events:

### Event:'feed'

The `feed` event emits a feed `Object` with following properties which can be `undefined`.

- `feed`
    - `copyright`
    - `id`
    - `image`
    - `language`
    - `link`
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
    - `duration`
    - `id`
    - `link`
    - `subtitle`
    - `summary`
    - `title`
    - `updated`

## Installation

Install with [npm](https://npmjs.org):

    npm install -g pickup

## License

[MIT License](https://raw.github.com/michaelnisi/pickup/master/LICENSE)
