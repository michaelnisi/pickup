# pickup - transform RSS or Atom XML to JSON 

The pickup [Node.js](http://nodejs.org/) module is a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream to transform RSS or Atom formatted XML to JSON.

[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.png)](http://travis-ci.org/michaelnisi/pickup)

## Usage
    
### Library

To transform from stdin to stdout:
    
    var pickup = require('pickup')
    , transformer = pickup()
    , Readable = require('stream').Readable
    , reader = new Readable().wrap(process.openStdin())
    , writer = process.stdout

    reader.pipe(transformer).pipe(writer)

### Command-line

Pipe [Gruber's](http://daringfireball.net/) podcast RSS feed to pickup:

    curl -sS http://feeds.feedburner.com/the_talk_show | pickup 

If you haven't already, I suggest you install [jsontool](https://github.com/trentm/json), a `json` command for working with JSON on the command-line:

    npm install -g jsontool

Piped to json it looks much nicer:

    curl -sS http://feeds.feedburner.com/the_talk_show | pickup | json
   
## Installation

Install with [npm](https://npmjs.org):

    npm install -g pickup

## License

[MIT License](https://raw.github.com/michaelnisi/pickup/master/LICENSE)
