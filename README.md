# pickup - ttansform RSS or Atom XML to JSON 

The pickup [Node.js](http://nodejs.org/) module is a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream that streams RSS or Atom formatted XML to JSON.

[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.png)](http://travis-ci.org/michaelnisi/pickup)

## Usage
    
Install [jsontool](https://github.com/trentm/json) to format JSON in the command-line:

    npm install -g jsontool
    
Clone pickup to run examples:
    
    git clone git://github.com/michaelnisi/pickup.git
    cd pickup
  
Pipe stdin to stdout:
  
    cat test/itunes.xml | node example/stdin.js | json

## Installation

Install with [npm](https://npmjs.org):

    npm install pickup

## License

[MIT License](https://raw.github.com/michaelnisi/pickup/master/LICENSE)
