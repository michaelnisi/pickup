# pickup - transform RSS or Atom XML to JSON 

Pickup streams podcast RSS feed [format](http://www.apple.com/itunes/podcasts/specs.html) to JSON.

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
