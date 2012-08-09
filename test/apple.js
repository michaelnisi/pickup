var path = 'apple.xml'
  , fstream = require('fs').createReadStream(path)
  , pickup = require('../lib/pickup.js')
  , test = require('tap').test
  , es = require('event-stream')
  , fs = require('fs')
  , expected = JSON.parse(fs.readFileSync('apple.json'))

test('apple', function (t) {
  es.connect(
    fstream.pipe(pickup()),
    es.writeArray(function (err, lines) {
      t.deepEqual(JSON.parse(lines.join('')), expected)
      t.end()
    })
  )   
})
