var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   pickup = require('../lib/pickup.js')()
,   test = require('tap').test
,   es = require('event-stream')
,   fs = require('fs')

var expected = JSON.parse(fs.readFileSync('./test/expected.json'))

test('iTunes', function (t) {
  es.connect(
    fstream.pipe(pickup),
    es.writeArray(function (err, lines) {
      t.deepEqual(JSON.parse(lines.join('')), expected)
      t.end()
    })
  )   
})


