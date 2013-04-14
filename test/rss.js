
// rss - test RSS example feed

var test = require('tap').test
  , es = require('event-stream')
  , fs = require('fs')
  , reader = fs.createReadStream('rss.xml')
  , pickup = require('../')
  , transformer = pickup()
  , expected = JSON.parse(fs.readFileSync('rss.json'))

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
    t.equal(items.length, 4, 'should emit four items')
  })

  reader.pipe(transformer).pipe(es.writeArray(function (err, lines) {
    t.deepEqual(JSON.parse(lines.join('')), expected)
    t.end()
  }))
})
