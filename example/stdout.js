var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   radio = require('../lib/radio.js')

fstream.pipe(radio).pipe(process.stdout)


