
// rss - test RSS example feed

var test = require('tap').test
  , es = require('event-stream')
  , fs = require('fs')
  , reader = fs.createReadStream('rss.xml')
  , pickup = require('../')
  , transformer = pickup()
  , expected = JSON.parse(fs.readFileSync('rss.json'))

test('rss', function (t) {
  var feeds = []
    , entries = []

  transformer.on('entry', function (entry) {
    entries.push(entry)
  })

  transformer.on('feed', function (feed) {
    feeds.push(feed)
  })

  transformer.on('end', function () {
    t.equal(feeds.length, 1, 'should emit one feed')
    t.equal(entries.length, 4, 'should emit four entries')
  })

  reader.pipe(transformer).pipe(es.writeArray(function (err, lines) {
    t.deepEqual(JSON.parse(lines.join('')), expected)
    t.end()
  }))
})
