// Usage
var request = require('request')
,   url = 'http://raumzeit-podcast.de/feed/'
,   transducer = require('./lib/radio.js')
,   path = 'feed.xml'
,   fstream = require('fs').createReadStream(path)

fstream.pipe(transducer).pipe(process.stdout)
