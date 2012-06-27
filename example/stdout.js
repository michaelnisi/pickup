var readStream = require('fs').createReadStream('./test/iTunes.xml')
,   pickup = require('../lib/pickup.js')()

readStream.pipe(pickup).pipe(process.stdout)
