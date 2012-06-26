var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   pickup = require('../lib/pickup.js')()
,   test = require('tap').test
,   es = require('event-stream')

test('iTunes', function (t) {
  var expected = getExpected()
  
  es.connect(
    fstream.pipe(pickup),
    es.writeArray(function (err, lines) {
      t.deepEqual(JSON.parse(lines.join('')), expected)
      t.end()
    })
  )   
})

function getExpected () {
  return [
    { key: 'title', value: 'All About Everything' }
  , { key: 'response', value: 200 }
  ]
}
