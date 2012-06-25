var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   pickup = require('../lib/radio.js')()

fstream.pipe(pickup).pipe(process.stdout)
