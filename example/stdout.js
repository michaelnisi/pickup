var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   pickup = require('../lib/pickup.js')()

fstream.pipe(pickup).pipe(process.stdout)
