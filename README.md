# pickup - pipe podcast RSS to JSON

[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.png)](http://travis-ci.org/michaelnisi/pickup)

## EXAMPLES

    npm install -g jsontool
    git clone git://github.com/michaelnisi/pickup.git
    cd pickup
  
Pipe stdin to stdout:
  
    curl -sS http://feeds.feedburner.com/back2work | node example/stdin.js | json


Pipe to stdout:
    
    node example/stdout.js | json

Proxy server:
    
    node example/proxy.js
    curl -sS http://127.0.0.1:8080/?uri=http://feeds.feedburner.com/back2work | json

## INSTALLATION

Install via [npm](http://npmjs.org/):

    npm install pickup

To install from source:

    git clone git://github.com/michaelnisi/pickup.git 
    cd pickup
    npm link
