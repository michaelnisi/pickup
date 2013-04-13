var path = 'itunes.xml'
  , JSONStream = require('JSONStream')
  , reader = require('fs').createReadStream(path)
  , pickup = require('../')
  , transformer = pickup()
  , test = require('tap').test
  , es = require('event-stream')
  , fs = require('fs')
  , expected = JSON.parse(fs.readFileSync('itunes.json'))

test('itunes', function (t) {
  var channels = []
    , items = []

  transformer.on('item', function (item) {
    items.push(item)
  })

  transformer.on('channel', function (channel) {
    channels.push(channel)
  })

  transformer.on('end', function () {
    t.equal(channels.length, 1, 'should emit one channel')
    t.equal(items.length, 3, 'should emit three items')
  })

  reader.pipe(transformer).pipe(es.writeArray(function (err, lines) {
    t.deepEqual(JSON.parse(lines.join('')), expected)
    t.end()
  }))
})
